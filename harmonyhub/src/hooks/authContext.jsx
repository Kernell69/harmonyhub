import { createContext, useReducer, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({
    state: {},
    actions: {},
});

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                isAuthenticated: false,
                token: null,
            };
        default:
            return state;
    }
}

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        token: localStorage.getItem("token"),
        isAuthenticated: localStorage.getItem("token") ? true : false,
    });
    const navigate = useNavigate();
    const location = useLocation();

    const actions = {
        login: (token) => {
            localStorage.setItem('token', token);
            dispatch({ type: ACTIONS.LOGIN, payload: token });
            const origin = location.state?.from?.pathname || "/home";
            navigate(origin);
        },
        logout: () => {
            localStorage.removeItem('token');
            dispatch({ type: ACTIONS.LOGOUT });
            navigate("/login");
        },
    };

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(type) {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context[type];
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthProvider, useAuth };