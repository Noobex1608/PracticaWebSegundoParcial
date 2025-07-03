# 🎵 Sistema de Gestión Musical

Sistema CRUD completo desarrollado con **React + TypeScript + Supabase** para gestionar artistas, usuarios y membresías musicales.

## 🚀 Características

- ✨ **Arquitectura por capas** bien estructurada
- 🎨 **CRUD completo** para 3 entidades principales
- 🔄 **Estados de carga y error** manejados correctamente
- 📱 **Interfaz responsive** y moderna
- 🛡️ **TypeScript** para mayor seguridad de tipos
- ☁️ **Supabase** como backend en la nube
- 🎯 **Validaciones** en formularios
- 📊 **Estadísticas** en tiempo real

## 📁 Estructura del Proyecto

```
src/
├── types/              # Definiciones de tipos TypeScript
│   ├── Artista.ts
│   ├── Usuario.ts
│   └── Membresia.ts
├── services/           # Servicios para comunicación con API
│   ├── supabaseConfig.ts
│   ├── artistaService.ts
│   ├── usuarioService.ts
│   └── membresiaService.ts
├── components/         # Componentes reutilizables
│   ├── Navigation.tsx
│   ├── ArtistaList.tsx
│   ├── ArtistaForm.tsx
│   ├── UsuarioList.tsx
│   ├── UsuarioForm.tsx
│   ├── MembresiaList.tsx
│   └── MembresiaForm.tsx
└── pages/              # Páginas principales (contenedores)
    ├── ArtistasPage.tsx
    ├── UsuariosPage.tsx
    └── MembresiasPage.tsx
```

## 🎯 Entidades

### 🎨 Artista
- **Campos**: nombre, biografía, género musical, foto, redes sociales
- **Funcionalidades**: Crear, leer, actualizar, eliminar, buscar por género

### 👥 Usuario  
- **Campos**: nombre, correo, edad, descripción
- **Funcionalidades**: Crear, leer, actualizar, eliminar, validación de correo único

### 🎫 Membresía
- **Campos**: usuario asociado, monto, fechas inicio/fin, estado
- **Funcionalidades**: Crear, leer, actualizar, eliminar, estadísticas, relación con usuario


## 👨‍💻 Desarrollado por

Steven Magallanes, Wendy Moreira, Nibia Rodriguez
Sistema desarrollado como parte de la práctica de desarrollo web con arquitectura por capas y integración con Supabase.

Steven Magallanes usuario
Wendy Moreira Artista
Nibia Rodriguez membresia

---

¡Disfruta gestionando tu sistema musical! 🎵
