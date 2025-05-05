use actix_web::{web, App, HttpResponse, HttpServer, Responder, middleware::Logger};
use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePool, FromRow};
use log::info;
use actix_cors::Cors;

// Модель для задачи
#[derive(Serialize, Deserialize, FromRow)]
struct Task {
    id: Option<i32>,
    title: String,
    completed: bool,
}

// Конфигурация базы данных и сервера
async fn init_db() -> SqlitePool {
    let pool = SqlitePool::connect("sqlite:database.db")
        .await
        .expect("Failed to connect to SQLite");

    // Создаем таблицу, если она не существует
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE
        )",
    )
    .execute(&pool)
    .await
    .expect("Failed to create table");

    pool
}

// POST: Создать задачу
async fn create_task(pool: web::Data<SqlitePool>, task: web::Json<Task>) -> impl Responder {
    let result = sqlx::query("INSERT INTO tasks (title, completed) VALUES (?, ?)")
        .bind(&task.title)
        .bind(task.completed)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => HttpResponse::Created().json("Task created"),
        Err(e) => HttpResponse::InternalServerError().json(format!("Error: {}", e)),
    }
}

// GET: Получить все задачи
async fn get_tasks(pool: web::Data<SqlitePool>) -> impl Responder {
    let tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks")
        .fetch_all(pool.get_ref())
        .await;

    match tasks {
        Ok(tasks) => HttpResponse::Ok().json(tasks),
        Err(e) => HttpResponse::InternalServerError().json(format!("Error: {}", e)),
    }
}

// PUT: Обновить задачу по ID
async fn update_task(
    pool: web::Data<SqlitePool>,
    task_id: web::Path<i32>,
    task: web::Json<Task>,
) -> impl Responder {
    let result = sqlx::query("UPDATE tasks SET title = ?, completed = ? WHERE id = ?")
        .bind(&task.title)
        .bind(task.completed)
        .bind(*task_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => HttpResponse::Ok().json("Task updated"),
        Err(e) => HttpResponse::InternalServerError().json(format!("Error: {}", e)),
    }
}

// DELETE: Удалить задачу по ID
async fn delete_task(pool: web::Data<SqlitePool>, task_id: web::Path<i32>) -> impl Responder {
    let result = sqlx::query("DELETE FROM tasks WHERE id = ?")
        .bind(*task_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => HttpResponse::Ok().json("Task deleted"),
        Err(e) => HttpResponse::InternalServerError().json(format!("Error: {}", e)),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Инициализация логирования
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Инициализация базы данных
    let pool = init_db().await;

    info!("Starting Actix Web server at http://{}", "127.0.0.1:8087");

    // Запуск сервера
    HttpServer::new(move || {
        let cors = Cors::default()
        .allowed_origin("http://localhost:5173") // Your React frontend origin
        .allowed_methods(vec!["GET", "POST","DELETE","PUT"])
        .allowed_headers(vec![
            actix_web::http::header::CONTENT_TYPE,
            actix_web::http::header::ACCEPT,
        ])
        .max_age(3600);

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(pool.clone()))
            .route("/tasks", web::post().to(create_task))
            .route("/tasks", web::get().to(get_tasks))
            .route("/tasks/{id}", web::put().to(update_task))
            .route("/tasks/{id}", web::delete().to(delete_task))
            
    })
    .bind("127.0.0.1:8087")?
    .workers(4) 
    .run()
    .await
}
