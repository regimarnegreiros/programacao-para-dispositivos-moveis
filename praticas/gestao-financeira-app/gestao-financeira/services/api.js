import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * URL base da API.
 *
 * Em desenvolvimento, o app tenta descobrir o IP da máquina automaticamente
 * através do servidor do Expo, evitando que você precise atualizar o .env 
 * a cada vez que o IP mudar.
 *
 * Você ainda pode forçar um IP específico usando EXPO_PUBLIC_API_URL no .env
 */
let BASE_URL = "http://10.0.2.2:3000";

if (process.env.EXPO_PUBLIC_API_URL) {
  BASE_URL = process.env.EXPO_PUBLIC_API_URL;
} else if (Platform.OS === "web") {
  BASE_URL = typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000";
} else if (__DEV__ && Constants.expoConfig?.hostUri) {
  const ip = Constants.expoConfig.hostUri.split(":")[0];
  BASE_URL = `http://${ip}:3000`;
}

/**
 * Função utilitária que executa uma requisição HTTP e padroniza o tratamento de erros.
 *
 * @param {string} path - Caminho da rota (ex.: "/categories").
 * @param {RequestInit} [options] - Opções do fetch (method, headers, body, etc.).
 * @returns {Promise<any|null>} Corpo da resposta em JSON, ou null em respostas 204.
 * @throws {Error} Quando a resposta tem status HTTP fora da faixa 2xx.
 */
let token = null;

export const setAuthToken = (newToken) => {
  token = newToken;
};

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  /**
   * Lista todas as categorias cadastradas.
   * @returns {Promise<Array>} Lista de categorias ordenadas por displayName.
   */
  listCategories: () => request("/categories"),

  /**
   * Cria uma nova categoria.
   * @param {{name: string, displayName: string, icon: string, background: string, isIncome?: boolean}} data
   * @returns {Promise<object>} Categoria criada.
   */
  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),

  /**
   * Atualiza uma categoria existente.
   * @param {string} id - id da categoria a atualizar.
   * @param {object} data - Campos a serem alterados (parcial).
   * @returns {Promise<object>} Categoria atualizada.
   */
  updateCategory: (id, data) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  /**
   * Exclui uma categoria (rejeita se for padrão).
   * @param {string} id - id da categoria.
   * @returns {Promise<null>} Resolve com null em caso de sucesso.
   */
  deleteCategory: (id) =>
    request(`/categories/${id}`, { method: "DELETE" }),

  /**
   * Lista todas as transações já com a categoria expandida.
   * @returns {Promise<Array>} Lista de transações ordenadas por data desc.
   */
  listTransactions: () => request("/transactions"),

  /**
   * Cria uma nova transação.
   * @param {{description: string, value: number, date: string|Date, categoryId: string}} data
   * @returns {Promise<object>} Transação criada com a categoria embutida.
   */
  createTransaction: (data) =>
    request("/transactions", { method: "POST", body: JSON.stringify(data) }),

  /**
   * Atualiza uma transação existente.
   * @param {string} id - id da transação.
   * @param {object} data - Campos a serem alterados (parcial).
   * @returns {Promise<object>} Transação atualizada.
   */
  updateTransaction: (id, data) =>
    request(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  /**
   * Exclui uma transação.
   * @param {string} id - id da transação.
   * @returns {Promise<null>} Resolve com null em caso de sucesso.
   */
  deleteTransaction: (id) =>
    request(`/transactions/${id}`, { method: "DELETE" }),

  /**
   * Login do usuário
   */
  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  /**
   * Registro de usuário
   */
  register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
};
