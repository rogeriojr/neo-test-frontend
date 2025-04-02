import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../stores/authStore";
import { FaSpinner, FaUser, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useNotification } from "../contexts/NotificationContext";
import {
  getProfile,
  updateProfile,
  ProfileData,
} from "../services/profileService";
import { getErrorMessage } from "../utils/errorHandler";

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

  @media (max-width: 768px) {
    width: 95%;
    max-height: 85vh;
    padding: 20px 15px;
    margin: 10px auto;
  }

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

const Section = styled.div`
  margin-bottom: 30px;
  width: 100%;
  max-width: 550px;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.color};
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
  padding: 10px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
  margin-bottom: 10px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
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

const Select = styled.select`
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

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  align-self: center;

  &:hover {
    background-color: ${({ theme }) => theme.color2};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const PhotoUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
`;

const PhotoPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
`;

const ContactText = styled.p`
  color: ${({ theme }) => theme.text};
  margin-bottom: 5px;
  font-size: 14px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { showNotification } = useNotification();
  const logout = useAuthStore.getState().logout;

  useEffect(() => {
    if (isOpen && user) {
      fetchProfileData();
    }
  }, [isOpen, user]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getProfile();

      if (response && response.retorno && response.dados) {
        setProfileData(response.dados);
        setFormData(response.dados);
      } else {
        throw new Error(
          response.descricao || response.erro || "Erro ao obter dados do perfil"
        );
      }
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      showNotification("error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);

      const response = await updateProfile(formData);

      if (response && response.retorno) {
        showNotification("success", "Perfil atualizado com sucesso!");
        fetchProfileData();
      } else {
        throw new Error(
          response.descricao ||
            response.erro ||
            "Erro ao atualizar dados do perfil"
        );
      }
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      showNotification("error", errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    try {
      logout();
      showNotification("info", "Você saiu da sua conta");
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      showNotification("error", errorMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "50px",
              height: "200px",
            }}
          >
            <FaSpinner
              style={{ fontSize: "30px", animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            {error}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Button type="button" onClick={fetchProfileData}>
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : profileData ? (
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>1. Dados Pessoais</SectionTitle>

              <PhotoUpload>
                <PhotoPlaceholder>
                  <FaUser size={40} color="#aaaaaa" />
                </PhotoPlaceholder>
                <Button
                  type="button"
                  style={{ padding: "8px", fontSize: "12px" }}
                >
                  Cadastrar Foto do Perfil
                </Button>
              </PhotoUpload>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>Nome</Label>
                  <Input
                    type="text"
                    name="nome"
                    value={formData.nome || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Sobrenome</Label>
                  <Input
                    type="text"
                    name="sobrenome"
                    value={formData.sobrenome || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>Senha</Label>
                  <Input type="password" placeholder="Nova senha" />
                </FormGroup>
                <FormGroup>
                  <Label>Confirmação de nova senha</Label>
                  <Input
                    type="password"
                    placeholder="Confirmação de nova senha"
                  />
                </FormGroup>
              </FormRow>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>DDI</Label>
                  <Input
                    type="text"
                    name="celular_ddi"
                    value={formData.celular_ddi || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Celular</Label>
                  <Input
                    type="tel"
                    name="celular_numero"
                    value={formData.celular_numero || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>Nascimento</Label>
                  <Input
                    type="text"
                    name="nascimento"
                    value={formData.nascimento || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Gênero</Label>
                  <Select
                    name="sexo"
                    value={formData.sexo || ""}
                    onChange={handleInputChange}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>2. Endereço</SectionTitle>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>CEP</Label>
                  <Input
                    type="text"
                    name="cep"
                    value={formData.cep || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Endereço</Label>
                  <Input
                    type="text"
                    name="endereco"
                    value={formData.endereco || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>Número</Label>
                  <Input
                    type="text"
                    name="numero"
                    value={formData.numero || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Complemento</Label>
                  <Input
                    type="text"
                    name="complemento"
                    value={formData.complemento || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>Bairro</Label>
                  <Input
                    type="text"
                    name="bairro"
                    value={formData.bairro || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Cidade</Label>
                  <Input
                    type="text"
                    name="cidade"
                    value={formData.cidade || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>

              <FormRow style={{ marginTop: "10px" }}>
                <FormGroup>
                  <Label>Estado</Label>
                  <Input
                    type="text"
                    name="estado"
                    value={formData.estado || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>País</Label>
                  <Input
                    type="text"
                    name="pais"
                    value={formData.pais || ""}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
            </Section>

            <Button
              type="submit"
              style={{ minWidth: "150px" }}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <FaSpinner
                    style={{
                      marginRight: "8px",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>

            <Button
              type="button"
              onClick={handleLogout}
              style={{
                minWidth: "150px",
                marginTop: "15px",
                backgroundColor: "#d32f2f",
                color: "white",
              }}
            >
              <FaSignOutAlt style={{ marginRight: "8px" }} />
              Sair
            </Button>

            <ContactInfo>
              <ContactText>Contato/Suporte:</ContactText>
              <SocialLinks>
                <ContactText>/biquinicavadao</ContactText>
                <ContactText style={{ marginLeft: "10px" }}>
                  /@biquini
                </ContactText>
              </SocialLinks>
            </ContactInfo>
          </Form>
        ) : null}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ProfileModal;
