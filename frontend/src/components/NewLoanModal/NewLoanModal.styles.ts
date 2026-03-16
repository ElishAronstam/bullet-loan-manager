import styled from "styled-components";
import { theme } from "../../theme";


export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const Modal = styled.div`
  background: ${theme.colors.surface};
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 8px 32px rgba(108, 99, 255, 0.15);
`;

export const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 20px;
  color: ${theme.colors.primary};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  color: ${theme.colors.text};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background: ${theme.colors.surface};
  color: ${theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.background};
  }
`;

export const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: ${theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: 13px;
  margin: 0;
`;
