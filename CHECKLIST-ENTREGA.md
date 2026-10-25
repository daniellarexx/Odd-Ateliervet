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
| 5 | Repositorio GitHub con el código + URL en el documento de entrega | **Pendiente de push** — `origin` = https://github.com/daniellarexx/Odd-Ateliervet.git · commit local `b4e0c9e` listo · falta `git push -u origin main` con credenciales de `daniellarexx` |
| 6 | ZIP del proyecto completo sin `.venv` / secretos / `.env` con contraseñas | **Hecho** (`odd-atelier-vet.zip`) |
| 7 | `README.md` con instalación, MySQL, ejecución Django y pruebas | **Hecho** |
| 8 | Documento de entrega: nombre de evidencia, ID/proyecto, enlace GitHub | **Hecho** (URL real escrita; código aún no visible en GitHub hasta el push) |

## Demo local

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/citas/

## Completar ítem 5 (en tu PC, con sesión GitHub)

```bash
cd /ruta/a/base-datos-Odd-Atelier-Vet
git remote -v
# origin https://github.com/daniellarexx/Odd-Ateliervet.git

gh auth login
# o: git push con PAT como contraseña HTTPS

git push -u origin main
```

Errores vistos en el agente (no inventados):
- HTTPS: `fatal: could not read Username for 'https://github.com': No such device or address`
- SSH: `Permission denied (publickey).`
- `gh auth status`: not logged into any GitHub hosts

No se usó force-push. El merge conserva el upload HTML en `legacy-html/`.

## Qué NO está en MySQL

Mascotas, Propietarios, Veterinarios, Medicamentos y Consultas → **localStorage**. Solo **Citas** (+ totales en Inicio) → **MySQL**.
