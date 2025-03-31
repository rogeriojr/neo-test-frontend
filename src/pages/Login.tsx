import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import { FaSpinner, FaQrcode } from "react-icons/fa";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-image: ${({ theme }) =>
    theme.background ? `url(${theme.background})` : "none"};
  background-color: ${({ theme }) =>
    theme.background ? "transparent" : theme.corBackground};
  background-size: cover;
  background-position: center;
`;

const LoginBox = styled.div`
  background-color: rgb(240, 240, 240, 0.5);
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text2};
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
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

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.color2};
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
`;

const CreateAccountLink = styled.p`
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-top: 20px;
  font-size: 14px;

  a {
    color: ${({ theme }) => theme.text2};
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      text-decoration: none;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  background-color: ${({ active, theme }) =>
    active ? theme.color : "rgba(0, 0, 0, 0.2)"};
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.color : "rgba(0, 0, 0, 0.3)"};
  }
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const QRCodeImage = styled.div`
  width: 200px;
  height: 200px;
  background-color: #fff;
  padding: 10px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QRCodeText = styled.p`
  color: ${({ theme }) => theme.text};
  text-align: center;
  font-size: 14px;
  margin-bottom: 10px;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"password" | "qrcode">(
    "password"
  );
  const [qrCodeChallenge, setQrCodeChallenge] = useState<string>("");
  const [qrCodePolling, setQrCodePolling] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isLoadingLocal, setIsLoadingLocal] = useState<boolean>(false);

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const recuperarSenha = useAuthStore((state) => state.recuperarSenha);
  const gerarDesafioQRCode = useAuthStore((state) => state.gerarDesafioQRCode);
  const validarDesafioQRCode = useAuthStore(
    (state) => state.validarDesafioQRCode
  );

  const layout = useThemeStore((state) => state.layout);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDeviceId = localStorage.getItem("@NeoIdea:deviceId");
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = `web-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("@NeoIdea:deviceId", newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);

  useEffect(() => {
    if (loginMethod === "qrcode" && email && !qrCodeChallenge) {
      generateQRCode();
    }
  }, [loginMethod, email]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (qrCodePolling && qrCodeChallenge && deviceId) {
      interval = setInterval(async () => {
        try {
          const validated = await validarDesafioQRCode(
            qrCodeChallenge,
            deviceId
          );
          if (validated) {
            clearInterval(interval);
            navigate("/");
          }
        } catch (err) {
          console.log(err, "Continuar tentando!");
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    qrCodePolling,
    qrCodeChallenge,
    deviceId,
    navigate,
    validarDesafioQRCode,
  ]);

  const generateQRCode = async () => {
    if (!email) return;

    try {
      setIsLoadingLocal(true);
      const result = await gerarDesafioQRCode(email);
      setQrCodeChallenge(result.desafio);
      setQrCodePolling(true);
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    } finally {
      setIsLoadingLocal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recoveryEmail) {
      return;
    }

    try {
      await recuperarSenha(recoveryEmail);
      setRecoverySuccess(true);
    } catch (err) {
      console.log(err, "Erro já é tratado no contexto de autenticação");
    }
  };

  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    setRecoverySuccess(false);
  };

  const renderQRCodeLogin = () => {
    return (
      <>
        <InputGroup>
          <Label htmlFor="qr-email">E-mail para gerar QR Code</Label>
          <Input
            id="qr-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>

        {!qrCodeChallenge && (
          <Button
            type="button"
            onClick={generateQRCode}
            disabled={isLoadingLocal || !email}
          >
            {isLoadingLocal ? (
              <>
                <FaSpinner
                  style={{
                    marginRight: "8px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Gerando QR Code...
              </>
            ) : (
              "Gerar QR Code"
            )}
          </Button>
        )}

        {qrCodeChallenge && (
          <QRCodeContainer>
            <QRCodeImage>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrCodeChallenge
                )}`}
                alt="QR Code para autenticação"
                width="180"
                height="180"
              />
            </QRCodeImage>
            <QRCodeText>
              Escaneie este QR Code com o aplicativo Neo Idea Mobile
            </QRCodeText>
            <QRCodeText>Aguardando autenticação...</QRCodeText>
            {qrCodePolling && isLoadingLocal && (
              <FaSpinner
                style={{
                  animation: "spin 1s linear infinite",
                  marginTop: "10px",
                  fontSize: "20px",
                  color: layout.text,
                }}
              />
            )}
            <Button
              type="button"
              onClick={generateQRCode}
              style={{ marginTop: "15px" }}
            >
              Gerar Novo QR Code
            </Button>
          </QRCodeContainer>
        )}
      </>
    );
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Neo Idea</Title>

        {!forgotPassword ? (
          <>
            <TabContainer>
              <Tab
                active={loginMethod === "password"}
                onClick={() => setLoginMethod("password")}
              >
                Senha
              </Tab>
              <Tab
                active={loginMethod === "qrcode"}
                onClick={() => setLoginMethod("qrcode")}
              >
                <FaQrcode style={{ marginRight: "5px" }} />
                QR Code
              </Tab>
            </TabContainer>

            {loginMethod === "password" ? (
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>

                <Button type="submit" disabled={isLoading}>
                  {isLoadingLocal ? (
                    <>
                      <FaSpinner
                        style={{
                          marginRight: "8px",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <CreateAccountLink>
                  <a onClick={toggleForgotPassword}>Esqueceu sua senha?</a>
                </CreateAccountLink>
              </Form>
            ) : (
              <Form onSubmit={(e) => e.preventDefault()}>
                {renderQRCodeLogin()}
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </Form>
            )}

            <CreateAccountLink>
              Não tem uma conta?{" "}
              <a
                href="https://app.neoidea.com.br/biquini"
                target="_blank"
                rel="noopener noreferrer"
              >
                Criar Conta
              </a>
            </CreateAccountLink>
          </>
        ) : (
          <>
            <Form onSubmit={handleRecoverPassword}>
              {!recoverySuccess ? (
                <>
                  <InputGroup>
                    <Label htmlFor="recovery-email">E-mail</Label>
                    <Input
                      id="recovery-email"
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      required
                    />
                  </InputGroup>

                  <Button type="submit" disabled={isLoading || isLoadingLocal}>
                    {isLoadingLocal ? (
                      <>
                        <FaSpinner
                          style={{
                            marginRight: "8px",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        Enviando...
                      </>
                    ) : (
                      "Recuperar Senha"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <p
                    style={{
                      color: "#4caf50",
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    Um e-mail de recuperação foi enviado para {recoveryEmail}.
                    Verifique sua caixa de entrada e siga as instruções para
                    redefinir sua senha.
                  </p>
                  <Button
                    type="button"
                    onClick={() => setForgotPassword(false)}
                  >
                    Voltar para Login
                  </Button>
                </>
              )}

              {error && <ErrorMessage>{error}</ErrorMessage>}

              {!recoverySuccess && (
                <CreateAccountLink>
                  <a onClick={toggleForgotPassword}>Voltar para Login</a>
                </CreateAccountLink>
              )}
            </Form>
          </>
        )}
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
