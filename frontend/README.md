# 📚 Book Recommendation System - Frontend

## 📝 About The Frontend

#### The **Frontend** is a modern, high-performance web application built with **React** and **Vite**. It provides an intuitive and visually stunning interface for users to discover programming books, manage their profiles, and explore personalized recommendations. The design emphasizes premium aesthetics, smooth animations, and an exceptional user experience.

## ✨ Key Features

#### 🎨 **Modern UI/UX Design**
- Glassmorphism effects and vibrant gradient color schemes
- Smooth animations and micro-interactions for enhanced engagement
- Fully responsive design that works seamlessly on all devices
- Dark-themed interface optimized for extended reading sessions

#### 🔐 **User Authentication**
- Secure signup and login system with encrypted local storage
- Password strength validation with visual feedback
- User profile management with customizable avatars
- Session persistence across browser refreshes

#### 📖 **Book Discovery**
- Dynamic book cards with rich information display
- Real-time fuzzy search with instant results
- Category-based filtering and sorting
- Direct Google search integration for each book

#### 🎯 **Personalization**
- Customizable programming interests selector
- Tag cloud visualization for technology trends
- User profile with editable information
- Seamless navigation between different sections

#### ⚡ **Performance Optimizations**
- Lazy loading and code splitting
- Optimized animations with CSS transforms
- Efficient state management with React Context
- Fast development server with Hot Module Replacement (HMR)

---

## 🛠 Tech Stack

- **Framework:** `React 19.2.0`
- **Build Tool:** `Vite 7.2.4`
- **Routing:** `React Router DOM 7.13.0`
- **Search:** `Fuse.js 7.1.0` (Fuzzy Search)
- **Visualization:** `TagCloud 2.5.0`
- **Styling:** `Vanilla CSS` with CSS Variables
- **Code Quality:** `ESLint 9.39.1`
- **Package Manager:** `npm`

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** `18.x` or higher
- **npm** `9.x` or higher

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📂 Project Structure

# 📂 Project Structure
#### A detailed overview of the project layout can be found here:  
👉 [Project Structure](FileStructure.md)

---

## 🎨 Design Philosophy

#### The frontend follows these core design principles:

1. **Visual Excellence**
   - Rich color palettes with harmonious gradients
   - Premium glassmorphism effects
   - Smooth micro-animations for user feedback

2. **User-Centric Design**
   - Intuitive navigation with keyboard shortcuts
   - Clear visual hierarchy and information architecture
   - Accessible and inclusive interface elements

3. **Performance First**
   - Optimized bundle size with code splitting
   - Lazy loading for improved initial load time
   - Efficient re-renders with React best practices

4. **Maintainability**
   - Modular component architecture
   - Consistent naming conventions
   - Well-documented code with clear comments

---

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🔒 Security Features

- **Password Encryption:** User passwords are hashed using bcrypt-like algorithms
- **Data Encryption:** Sensitive data stored in localStorage is encrypted using AES
- **Input Validation:** All user inputs are validated and sanitized
- **Session Management:** Secure session handling with automatic cleanup

---

## 💾 Data Persistence

#### The application uses **localStorage** for data persistence with the following strategy:

- **Encrypted Storage:** All sensitive data is encrypted before storage
- **User Data:** Profile information, preferences, and favorites
- **Session Data:** Authentication tokens and user sessions
- **Cache Management:** Automatic cleanup of expired data

---

## 🎯 Key Components

### BookCard
Displays comprehensive book information with:
- Visual gradient backgrounds
- Star rating system
- Book metadata (pages, year, category)
- Direct link to view book details

### SearchBar
Powerful search functionality with:
- Real-time fuzzy search using Fuse.js
- Keyboard navigation support
- Search history (optional feature)
- Instant results display

### Profile
User profile management with:
- Editable personal information
- Avatar customization
- Programming interests selector
- Account settings

### TechTicker
Animated technology ticker displaying:
- Trending programming technologies
- Smooth auto-scroll animation
- Category-based organization

---

## 🌐 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

---

## 🐛 Known Issues

No major issues at this time. For any bugs or feature requests, please contact the development team.

---

## 📄 License

This project is source-available for non-commercial use under the Business Source License 1.1.  
It will become fully open-source under Apache License 2.0 on **2030-01-01**.

---

## 👨‍💻 Development Notes

#### **Code Style**
- Use functional components with React Hooks
- Follow ESLint configuration for consistent code style  
- Use CSS variables for theming and consistency
- Keep components small and focused on single responsibility

#### **Adding New Features**
1. Create component in appropriate directory
2. Add necessary styles in component's CSS file
3. Import and integrate in parent component
4. Test functionality and responsiveness
5. Run `npm run lint` to ensure code quality

---
