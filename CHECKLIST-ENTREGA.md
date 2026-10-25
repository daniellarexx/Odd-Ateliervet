# Checklist SENA — Módulos de software codificados y probados

Proyecto: **Odd Atelier Vet** (Citas Django + MySQL integradas)  
Aprendiz: Daniela Sofia Guerra Alarcon · Ficha 3336222  
Instructor: Ricardo Alfonso González Vargas.  
Repo: https://github.com/daniellarexx/Odd-Ateliervet

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Proyecto funcional Odd Atelier + Citas (Python/Django/MySQL), una sola app en `:8000` | **Hecho** |
| 2 | CRUD crear / listar / editar / eliminar citas | **Hecho** |
| 3 | Validaciones + paginación máximo 10 por página | **Hecho** |
| 4 | Pruebas automatizadas (`manage.py test citas` → 6 OK) + verificación en navegador | **Hecho** |
| 5 | Repositorio GitHub con el código + URL en el documento de entrega | **Hecho** — push `main` OK · commit `cfa3875f11fb9f47983ef4286388dc6190b98883` · URL https://github.com/daniellarexx/Odd-Ateliervet · verificados `manage.py` y `citas/` en el remoto |
| 6 | ZIP del proyecto completo sin `.venv` / secretos / `.env` con contraseñas | **Hecho** (`odd-atelier-vet.zip`) |
| 7 | `README.md` con instalación, MySQL, ejecución Django y pruebas | **Hecho** |
| 8 | Documento de entrega: nombre de evidencia, ID/proyecto, enlace GitHub | **Hecho** (URL real; código visible en GitHub) |

## Demo local

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/citas/

## Ítem 5 — completado (Sofia / Windows)

```text
Repo local: C:\Users\danie\Desktop\Odd-Ateliervet-repo
Remote:     https://github.com/daniellarexx/Odd-Ateliervet.git
Branch:     main
Commit:     cfa3875f11fb9f47983ef4286388dc6190b98883
Push:       d2e8937..cfa3875  main -> main (non-force)
```

HTML previo conservado en `legacy-html/`. Sin `.env` de secretos; sí `.env.example`.

## Qué NO está en MySQL

Mascotas, Propietarios, Veterinarios, Medicamentos y Consultas → **localStorage**. Solo **Citas** (+ totales en Inicio) → **MySQL**.
