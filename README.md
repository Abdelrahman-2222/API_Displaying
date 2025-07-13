# E-Commerce Web Application

A simple e-commerce web application built with HTML, CSS, JavaScript, and TypeScript. The application features user authentication, product browsing, and a mock backend using JSON Server.

## Features

- **User Authentication**: Sign up and login functionality
- **Product Catalog**: Browse and view product details
- **Responsive Design**: Mobile-friendly interface using Bootstrap
- **TypeScript Support**: Type-safe JavaScript development
- **Mock Backend**: JSON Server for development and testing

## Project Structure

```
├── index.html          # Main signup page
├── login.html          # User login page
├── home.html           # Product catalog/home page
├── details.html        # Product details page
├── db.json             # Mock database for JSON Server
├── package.json        # Node.js dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── assets/
│   └── images/         # Application images
├── js/                 # Compiled JavaScript files
├── ts/                 # TypeScript source files
└── styling/            # CSS stylesheets
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Bootstrap 5.3.7
- **JavaScript**: ES2020, TypeScript 5.8.3
- **Backend**: JSON Server (Mock REST API)
- **Icons**: Font Awesome 6.7.2
- **Styling**: Bootstrap + Custom CSS

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone or download this repository**

2. **Navigate to the project directory**
   ```bash
   cd "Advanced JS and TS Project"
   ```

3. **Install required packages**
   ```bash
   npm install
   ```

   This will install the following dependencies:
   - `bootstrap@^5.3.7` - CSS framework for responsive design
   - `@fortawesome/fontawesome-free@^6.7.2` - Icon library
   - `json-server@^1.0.0-beta.3` - Mock REST API server
   - `typescript@^5.8.3` - TypeScript compiler

## Running the Application

### 1. Start the JSON Server (Backend)

The application uses JSON Server to provide a mock REST API for user data and products.

```bash
npm run json-server
```

or

```bash
npm run start-server
```

This will start the JSON Server on `http://localhost:3000` and watch the `db.json` file for changes.

### 2. Compile TypeScript (if needed)

If you make changes to TypeScript files in the `ts/` directory, compile them to JavaScript:

```bash
npx tsc
```

This will compile all TypeScript files according to the `tsconfig.json` configuration.

### 3. Open the Application

Open any of the HTML files in your browser:

- `index.html` - Start with user registration
- `login.html` - User login page
- `home.html` - Product catalog (requires authentication)
- `details.html` - Product details page

**Recommended flow**: Start with `index.html` to create an account, then proceed to `login.html`, and finally `home.html`.

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## File Structure Details

### TypeScript Configuration
- **Target**: ES2020
- **Module**: CommonJS
- **Root Directory**: `./ts`
- **Output Directory**: `./js`

### Git Ignore
The following files/directories should be ignored in version control:
- `.vs/` - Visual Studio files
- `package-lock.json` - npm lock file
- `node_modules/` - npm dependencies
- `tsconfig.json` - TypeScript configuration (if not needed in repo)

## Development Workflow

1. **Edit TypeScript files** in the `ts/` directory
2. **Compile TypeScript** using `npx tsc`
3. **Start JSON Server** using `npm run json-server`
4. **Open HTML files** in your browser to test
5. **Edit CSS files** in the `styling/` directory for styling changes

## Troubleshooting

### Common Issues

1. **Bootstrap/Font Awesome not loading**
   - Ensure `npm install` was run successfully
   - Check that `node_modules/` directory exists
   - Verify file paths in HTML files

2. **JSON Server not starting**
   - Check if port 3000 is available
   - Ensure `db.json` file exists and is valid JSON

3. **TypeScript compilation errors**
   - Check `tsconfig.json` configuration
   - Ensure TypeScript is installed: `npm install -g typescript`

## Browser Compatibility

This application supports modern browsers that support:
- ES2020 JavaScript features
- CSS Grid and Flexbox
- Bootstrap 5.3.7 requirements

## License

This project is licensed under the ISC License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request