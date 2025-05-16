

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import {
//   ClerkProvider,
//   SignedIn,
//   SignedOut,
//   SignIn,
//   SignUp,
// } from "@clerk/clerk-react";
// import { ThemeProvider, createTheme } from "@mui/material";
// import CssBaseline from "@mui/material/CssBaseline";
// import Home from "./pages/Home";
// import PlaylistGenerator from "./pages/PlaylistGenerator";
// import Favorites from "./pages/Favorites";

// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#1DB954", // Spotify green
//     },
//     secondary: {
//       main: "#FFFFFF",
//     },
//   },
//   components: {
//     MuiButton: {
//       defaultProps: {
//         "aria-label": "Action button",
//       },
//     },
//     MuiTextField: {
//       defaultProps: {
//         inputProps: {
//           "aria-required": "true",
//           "aria-label": "Input field",
//         },
//       },
//     },
//   },
// });

// function App() {
//   const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

//   if (!clerkPubKey) {
//     return (
//       <div role="alert" aria-live="assertive">
//         Error: Missing Clerk publishable key
//       </div>
//     );
//   }

//   return (
//     <ClerkProvider
//       publishableKey={clerkPubKey}
//       appearance={{
//         elements: {
//           formButtonPrimary: {
//             backgroundColor: "#1DB954",
//             "&:hover": {
//               backgroundColor: "#1ed760",
//             },
//             "aria-label": "Submit form",
//           },
//         },
//       }}
//     >
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <BrowserRouter>
//           <main aria-label="Application content">
//             <Routes>
//               <Route
//                 path="/"
//                 element={<Home aria-label="Home page" />}
//               />
//               <Route
//                 path="/signin/*"
//                 element={
//                   <SignIn
//                     routing="path"
//                     path="/signin"
//                     appearance={{
//                       elements: {
//                         formButtonPrimary: {
//                           backgroundColor: "#1DB954",
//                           "&:hover": {
//                             backgroundColor: "#1ed760",
//                           },
//                           "aria-label": "Sign in button",
//                         },
//                       },
//                     }}
//                     aria-labelledby="signin-heading"
//                   />
//                 }
//               />
//               <Route
//                 path="/signup/*"
//                 element={
//                   <SignUp
//                     routing="path"
//                     path="/signup"
//                     appearance={{
//                       elements: {
//                         formButtonPrimary: {
//                           backgroundColor: "#1DB954",
//                           "&:hover": {
//                             backgroundColor: "#1ed760",
//                           },
//                           "aria-label": "Sign up button",
//                         },
//                       },
//                     }}
//                     aria-labelledby="signup-heading"
//                   />
//                 }
//               />
//               <Route
//                 path="/generate"
//                 element={
//                   <>
//                     <SignedIn>
//                       <div aria-label="Playlist Generator page">
//                         <PlaylistGenerator />
//                       </div>
//                     </SignedIn>
//                     <SignedOut>
//                       <Navigate
//                         to="/signin"
//                         aria-label="Redirecting to sign in page"
//                       />
//                     </SignedOut>
//                   </>
//                 }
//               />
//               <Route
//                 path="/favorites"
//                 element={
//                   <>
//                     <SignedIn>
//                       <div aria-label="Favorites page">
//                         <Favorites />
//                       </div>
//                     </SignedIn>
//                     <SignedOut>
//                       <Navigate
//                         to="/signin"
//                         aria-label="Redirecting to sign in page"
//                       />
//                     </SignedOut>
//                   </>
//                 }
//               />
//             </Routes>
//           </main>
//         </BrowserRouter>
//       </ThemeProvider>
//     </ClerkProvider>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import PlaylistGenerator from "./pages/PlaylistGenerator";
import Favorites from "./pages/Favorites";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1DB954", // Spotify green
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        "aria-label": "Action button",
      },
    },
    MuiTextField: {
      defaultProps: {
        inputProps: {
          "aria-required": "true",
          "aria-label": "Input field",
        },
      },
    },
  },
});

function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    return (
      <div role="alert" aria-live="assertive">
        Error: Missing Clerk publishable key
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        elements: {
          formButtonPrimary: {
            backgroundColor: "#1DB954",
            "&:hover": {
              backgroundColor: "#1ed760",
            },
            "aria-label": "Submit form",
          },
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <main aria-label="Application content">
            <Routes>
              <Route
                path="/"
                element={<Home aria-label="Home page" />}
              />
              <Route
                path="/signin/*"
                element={
                  <SignIn
                    routing="path"
                    path="/signin"
                    appearance={{
                      elements: {
                        formButtonPrimary: {
                          backgroundColor: "#1DB954",
                          "&:hover": {
                            backgroundColor: "#1ed760",
                          },
                          "aria-label": "Sign in button",
                        },
                      },
                    }}
                    aria-labelledby="signin-heading"
                  />
                }
              />
              <Route
                path="/signup/*"
                element={
                  <SignUp
                    routing="path"
                    path="/signup"
                    appearance={{
                      elements: {
                        formButtonPrimary: {
                          backgroundColor: "#1DB954",
                          "&:hover": {
                            backgroundColor: "#1ed760",
                          },
                          "aria-label": "Sign up button",
                        },
                      },
                    }}
                    aria-labelledby="signup-heading"
                  />
                }
              />
              <Route
                path="/generate"
                element={
                  <>
                    <SignedIn>
                      <div aria-label="Generate your playlist based on emotion and memory">
                        <PlaylistGenerator />
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <Navigate
                        to="/signin"
                        aria-label="Redirecting to sign in page"
                      />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="/favorites"
                element={
                  <>
                    <SignedIn>
                      <div aria-label="Favorites page">
                        <Favorites />
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <Navigate
                        to="/signin"
                        aria-label="Redirecting to sign in page"
                      />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </main>
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
