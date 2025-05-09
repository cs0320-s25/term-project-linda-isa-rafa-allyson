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
// });

// function App() {
//   const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

//   console.log("Clerk key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

//   if (!clerkPubKey) {
//     console.error("Missing Clerk publishable key");
//     return <div>Error: Missing Clerk publishable key</div>;
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
//           },
//         },
//       }}
//     >
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route
//               path="/signin/*"
//               element={
//                 <SignIn
//                   routing="path"
//                   path="/signin"
//                   appearance={{
//                     elements: {
//                       formButtonPrimary: {
//                         backgroundColor: "#1DB954",
//                         "&:hover": {
//                           backgroundColor: "#1ed760",
//                         },
//                       },
//                     },
//                   }}
//                 />
//               }
//             />
//             <Route
//               path="/signup/*"
//               element={
//                 <SignUp
//                   routing="path"
//                   path="/signup"
//                   appearance={{
//                     elements: {
//                       formButtonPrimary: {
//                         backgroundColor: "#1DB954",
//                         "&:hover": {
//                           backgroundColor: "#1ed760",
//                         },
//                       },
//                     },
//                   }}
//                 />
//               }
//             />
//             <Route
//               path="/generate"
//               element={
//                 <>
//                   <SignedIn>
//                     <PlaylistGenerator />
//                   </SignedIn>
//                   <SignedOut>
//                     <Navigate to="/signin" />
//                   </SignedOut>
//                 </>
//               }
//             />
//             <Route
//               path="/favorites"
//               element={
//                 <>
//                   <SignedIn>
//                     <Favorites />
//                   </SignedIn>
//                   <SignedOut>
//                     <Navigate to="/signin" />
//                   </SignedOut>
//                 </>
//               }
//             />
//           </Routes>
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
        // Adding default aria attributes to buttons
        "aria-label": "Action button",
      },
    },
    MuiTextField: {
      defaultProps: {
        // Improving form field accessibility
        inputProps: { "aria-required": "true" },
      },
    },
  },
});

function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  console.log("Clerk key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (!clerkPubKey) {
    console.error("Missing Clerk publishable key");
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
          },
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <main aria-label="Application content">
            <Routes>
              <Route path="/" element={<Home />} />
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
                      <PlaylistGenerator />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/signin" aria-label="Redirecting to sign in page" />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="/favorites"
                element={
                  <>
                    <SignedIn>
                      <Favorites />
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/signin" aria-label="Redirecting to sign in page" />
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