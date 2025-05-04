import { useNavigate } from 'react-router-dom';

export const useValidateChessMode = () => {
  const navigate = useNavigate();

  return () => {
    const roomID = localStorage.getItem("roomID");
    if (!roomID) return true; // No roomID, return true since it's valid for now

    const routeMap = {
      "_PHANTOM": "/chessgame",
      "_HQ": "/hqchessgame",
      "_PP": "/ppchessgame",
      "_FB": "/fbchessgame",
      "_MK":"/mkchessgame"
    };

    let matchedRoute = null;

    for (const [suffix, route] of Object.entries(routeMap)) {
      if (roomID.endsWith(suffix)) {
        matchedRoute = route;
        break;
      }
    }

    if (matchedRoute) {
      const currentPath = window.location.pathname;
      if (currentPath !== matchedRoute) {
        navigate(matchedRoute, { replace: true });
      }
      return true; // Mode is valid
    } else {
      return false; // Mode is invalid
    }
  };
};
