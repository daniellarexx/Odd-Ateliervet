# Odd Atelier Vet — módulos codificados y probados (Django + MySQL)

Aplicación web **única** de Odd Atelier Vet. El diseño y el menú lateral se sirven con **Django**. El módulo **Citas** implementa CRUD completo con persistencia en **MySQL**. Los demás módulos del menú conservan la interfaz HTML/JS original con **localStorage** (aún no migrados a MySQL).

**Evidencia SENA:** Módulos de software codificados y probados  
**Proyecto:** Odd Atelier Vet · Clínica veterinaria  
**Repositorio:** https://github.com/daniellarexx/Odd-Ateliervet  
**Puerto de demo:** http://127.0.0.1:8000/

## Sitio HTML anterior

La carga estática original de este repositorio (Index.html, app.js, estilos.css, logos) se conserva en `legacy-html/` para no perder el historial del upload previo. La aplicación principal ahora es Django (raíz del repo).

## Qué usa MySQL y qué no

| Menú | Tecnología | Persistencia |
|------|------------|--------------|
| Inicio | Plantilla Django | Totales de citas desde MySQL |
| **Citas** | Django CRUD (ModelForm) | **MySQL** |
| Mascotas, Propietarios, Veterinarios, Medicamentos, Consultas | Interfaz Odd Atelier HTML/JS | **localStorage** |

## Requisitos

- Python 3.12 o superior
- Docker Compose **o** MySQL/Laragon local
- Navegador moderno

## 1. Instalación

```bash
cd Odd-Ateliervet
cp .env.example .env
# Edita .env y cambia las contraseñas (no subas .env al repositorio)

python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Configuración de MySQL

Con Docker (recomendado; puerto host **3307**):

```bash
docker compose --env-file .env up -d
```

Variables relevantes en `.env` / `.env.example`:

- `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`
- `MYSQL_HOST=127.0.0.1`, `MYSQL_PORT=3307`
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`

Si usas Laragon/MySQL nativo, ajusta `MYSQL_HOST` y `MYSQL_PORT` (suele ser `3306`) y crea la base y el usuario con los mismos nombres.

Privilegios para pruebas automatizadas:

```sql
GRANT ALL PRIVILEGES ON `test_odd_atelier_vet`.* TO 'odd_user'@'%';
FLUSH PRIVILEGES;
```

## 3. Ejecutar Django

```bash
python manage.py migrate
python manage.py seed_citas        # opcional: datos de demo (>10 citas)
python manage.py runserver 8000
```

Abre: **http://127.0.0.1:8000/**

- Inicio: http://127.0.0.1:8000/
- Citas (MySQL): http://127.0.0.1:8000/citas/
- Nueva cita: http://127.0.0.1:8000/citas/nueva/
- Otros módulos: menú lateral (misma app, localStorage)

## 4. Pruebas automatizadas

```bash
python manage.py test citas -v 2
```

Cubren: listar, crear válido, crear inválido (no guarda), editar, eliminar solo con POST, paginación de **10** registros por página.

## Estructura del proyecto

```
Odd-Ateliervet/
  manage.py
  requirements.txt
  README.md
  .gitignore
  .env.example
  docker-compose.yml
  config/          # settings, urls raíz
  atelier/         # shell Odd Atelier (inicio + módulos legado)
  citas/           # CRUD MySQL + tests
  templates/       # plantillas del shell
  static/          # CSS/JS/assets Odd Atelier
  legacy-html/     # upload HTML estático previo (conservado)
```

## Entrega SENA (checklist)

1. Proyecto funcional Odd Atelier + Citas (Python/Django/MySQL) en `:8000`
2. CRUD crear / listar / editar / eliminar citas
3. Validaciones + paginación máximo 10 por página
4. Pruebas automatizadas + verificación en navegador
5. Repositorio GitHub con el código + URL en el documento
6. ZIP del proyecto sin `.venv`, secretos ni `.env` con contraseñas
7. README con instalación, MySQL, ejecución y pruebas
8. Documento de entrega (nombre de evidencia, proyecto, enlace GitHub)
