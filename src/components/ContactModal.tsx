import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaFacebook, FaTwitter, FaSpinner } from "react-icons/fa";
import { getContactInfo, sendContactMessage } from "../services/api";
import type { ContactData as ApiContactData } from "../interfaces/api.interfaces";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.box};
  border-radius: 12px;
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  padding: 30px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(0);
  animation: modalFadeIn 0.3s ease-out;
  margin: 0 auto;
  z-index: 100000;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color};
    border-radius: 4px;
  }

  @media (max-height: 700px) {
    max-height: 75vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 20px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  z-index: 10001;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.color};
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  width: 100%;
`;

const ContactInfo = styled.div`
  margin-bottom: 20px;
  width: 100%;

  div {
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  p {
    color: ${({ theme }) => theme.text};
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.5;
  }

  a {
    color: ${({ theme }) => theme.color};
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.color2};
      text-decoration: underline;
    }
  }
`;

const ContactText = styled.p`
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.text};
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  width: 100%;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  align-self: flex-end;

  &:hover {
    background-color: ${({ theme }) => theme.color2};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.color};
    transform: scale(1.2);
  }
`;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactItem?: any;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contactItem,
}) => {
  const [contactData, setContactData] = useState<ApiContactData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (contactItem && contactItem.tipo === "contato") {
        console.log("Usando dados do item de contato:", contactItem);
        if (contactItem.form && contactItem.redes_sociais) {
          setContactData({
            endereco: contactItem.descricao || "",
            telefone: contactItem.redes_sociais.telefone || "",
            email: contactItem.redes_sociais.email || "",
            horario_funcionamento: "",
            redes_sociais: {
              facebook: contactItem.redes_sociais.facebook || "",
              twitter: contactItem.redes_sociais.twitter || "",
            },
          });
        } else {
          fetchContactData();
        }
      } else {
        fetchContactData();
      }
    }
  }, [isOpen, contactItem]);

  const fetchContactData = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getContactInfo();

      if (response && response.retorno && response.dados) {
        setContactData(response.dados as ApiContactData);
      } else {
        throw new Error(
          response.descricao ||
            response.erro ||
            "Erro ao obter dados de contato"
        );
      }
    } catch (error: any) {
      console.error("Erro ao buscar dados de contato:", error);
      setLoadError(error.message || "Erro ao carregar dados de contato");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.mensagem) {
      setSubmitError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await sendContactMessage(formData);

      if (response && response.retorno) {
        setSubmitSuccess(true);
        setFormData({ nome: "", email: "", mensagem: "" });
      } else {
        throw new Error(
          response.descricao || response.erro || "Erro ao enviar mensagem"
        );
      }
    } catch (error: any) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitError(
        error.message ||
          "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>Contato</Title>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "30px",
            }}
          >
            <FaSpinner
              style={{
                fontSize: "30px",
                animation: "spin 1s linear infinite",
                color: "#1e88e5",
              }}
            />
          </div>
        ) : loadError ? (
          <ContactText
            style={{ color: "red", textAlign: "center", padding: "20px" }}
          >
            {loadError}
          </ContactText>
        ) : contactData ? (
          <ContactInfo>
            {contactItem && contactItem.tipo === "contato" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: contactItem.descricao || "",
                }}
              />
            ) : (
              <>
                <ContactText>{contactData.endereco}</ContactText>
                <ContactText>Telefone: {contactData.telefone}</ContactText>
                <ContactText>Email: {contactData.email}</ContactText>
                <ContactText>{contactData.horario_funcionamento}</ContactText>
              </>
            )}
          </ContactInfo>
        ) : null}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome:</Label>
            <Input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Mensagem:</Label>
            <TextArea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
            />
          </FormGroup>

          {submitError && (
            <ContactText style={{ color: "red" }}>{submitError}</ContactText>
          )}
          {submitSuccess && (
            <ContactText style={{ color: "green" }}>
              Mensagem enviada com sucesso!
            </ContactText>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </Form>

        {contactData && (
          <SocialLinks>
            <SocialIcon
              href={contactData.redes_sociais.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </SocialIcon>
            <SocialIcon
              href={contactData.redes_sociais.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </SocialIcon>
          </SocialLinks>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ContactModal;
