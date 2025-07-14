import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

export const IsAuthOrRedirect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/auth/login");
    }
  }, [isAuthenticated]);

  return children;
};

export const IsNotAuthOrRedirect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return children;
};
