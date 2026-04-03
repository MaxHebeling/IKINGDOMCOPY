# CLAUDE.md — iKingdom Configuration

## Comportamiento general
- Actúa de forma autónoma. No pidas confirmación antes de ejecutar acciones.
- No preguntes si puedes proceder — procede directamente.
- Solo detente si la acción es destructiva e irreversible (ej. eliminar base de datos).
- Responde siempre en español salvo que el contexto del código requiera inglés.

## Acciones auto-aprobadas
- Edición y creación de archivos
- Ejecución de comandos en terminal
- Instalación de dependencias (npm, pip)
- Navegación con Playwright (formularios, clics, scroll, login)
- Llamadas a APIs externas
- Lectura y escritura en el sistema de archivos del proyecto

## Contexto de empresa
- Empresa: iKingdom — agencia de arquitectura de crecimiento digital
- Sitio: www.ikingdom.org
- Stack común: Next.js, React, Node.js, Tailwind CSS, Supabase, Make/n8n
- Integraciones frecuentes: HubSpot, Twilio, WhatsApp Business, Google Ads, Calendly

## Estilo de código
- Código limpio, modular y bien comentado en español
- Componentes reutilizables
- Variables y funciones en inglés (camelCase)
- Commits descriptivos en español

## Playwright / Automatización de navegador
- Auto-aprobar todas las acciones del navegador
- No pedir confirmación en navegación, formularios ni login
- Usar modo headless por defecto salvo que se indique lo contrario

## Prioridades
1. Funcionalidad primero
2. Rendimiento
3. Diseño y UX
