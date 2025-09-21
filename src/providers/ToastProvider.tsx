import React, { createContext, useContext, useState, ReactNode } from "react";

import Toast, { ToastType } from "../components/Toast";

interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    options?: {
      duration?: number;
      actionText?: string;
      onAction?: () => void;
    }
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  actionText?: string;
  onAction?: () => void;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
    duration: 4000,
  });

  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: {
      duration?: number;
      actionText?: string;
      onAction?: () => void;
    }
  ) => {
    setToastState({
      visible: true,
      message,
      type,
      duration: options?.duration || 4000,
      actionText: options?.actionText,
      onAction: options?.onAction,
    });
  };

  const hideToast = () => {
    setToastState(prev => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onHide={hideToast}
        actionText={toastState.actionText}
        onAction={toastState.onAction}
      />
    </ToastContext.Provider>
  );
}
