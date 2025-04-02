/**
 * Utilitário para traduzir códigos de erro HTTP e mensagens de erro em mensagens amigáveis em português
 */

interface ErrorResponse {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: {
      descricao?: string;
      erro?: string;
      message?: string;
    };
  };
}

/**
 * Traduz códigos de erro HTTP para mensagens amigáveis em português
 */
export const getHttpErrorMessage = (status: number): string => {
  const errorMessages: Record<number, string> = {
    400: 'Requisição inválida. Por favor, verifique os dados informados.',
    401: 'Você não está autenticado. Por favor, faça login novamente.',
    403: 'Você não tem permissão para acessar este recurso.',
    404: 'O recurso solicitado não foi encontrado.',
    408: 'A requisição excedeu o tempo limite. Por favor, tente novamente.',
    409: 'Conflito ao processar a requisição. Por favor, tente novamente.',
    422: 'Não foi possível processar os dados enviados. Verifique as informações.',
    429: 'Muitas requisições. Por favor, aguarde um momento e tente novamente.',
    500: 'Erro interno do servidor. Por favor, tente novamente mais tarde.',
    502: 'Serviço temporariamente indisponível. Por favor, tente novamente mais tarde.',
    503: 'Serviço temporariamente indisponível. Por favor, tente novamente mais tarde.',
    504: 'Tempo limite da requisição excedido. Por favor, tente novamente.',
  };

  return errorMessages[status] || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
};

export const getErrorMessage = (error: ErrorResponse): string => {
  if (error.response) {
    const status = error.response.status;

    const apiErrorMessage =
      error.response.data?.descricao ||
      error.response.data?.erro ||
      error.response.data?.message;

    if (apiErrorMessage) {
      return apiErrorMessage;
    }

    if (status) {
      return getHttpErrorMessage(status);
    }
  }

  if (error.message && error.message.includes('timeout')) {
    return 'A conexão excedeu o tempo limite. Verifique sua internet e tente novamente.';
  }

  if (error.message && error.message.includes('Network Error')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }

  return error.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
};