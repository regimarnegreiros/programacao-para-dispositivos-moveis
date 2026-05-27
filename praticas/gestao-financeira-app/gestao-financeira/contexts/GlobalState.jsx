import { createContext, useCallback, useEffect, useState } from "react";
import { api, setAuthToken } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MoneyContext = createContext();

/**
 * Provider global do app.
 *
 * Centraliza:
 *  - hidratação inicial das categorias e transações a partir da API REST;
 *  - estado de carregamento e erro de rede;
 *  - ações para criar/excluir transações e categorias mantendo o estado em sync.
 *
 * O estado **não** é mais persistido em AsyncStorage. A fonte de verdade é o
 * banco MySQL exposto pela API (`gestao-financeira-api/`).
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element} Provider com o objeto de contexto exposto via `MoneyContext`.
 */
export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Initialize auth state
  useEffect(() => {
    AsyncStorage.getItem("@auth_token").then((token) => {
      if (token) {
        setAuthToken(token);
        AsyncStorage.getItem("@auth_user").then((userData) => {
          if (userData) setUser(JSON.parse(userData));
          refresh();
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  /**
   * Recarrega categorias e transações do servidor em paralelo.
   *
   * @returns {Promise<void>} Resolve quando ambos os GETs terminarem.
   */
  const refresh = useCallback(async () => {
    if (!user) return; // Wait for user to be loaded or logged in
    setLoading(true);
    setError(null);
    try {
      const [cats, txs] = await Promise.all([
        api.listCategories(),
        api.listTransactions(),
      ]);
      setCategories(cats);
      setTransactions(txs);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refresh();
    }
  }, [refresh, user]);

  /**
   * Cria uma nova transação no servidor e adiciona-a ao estado local.
   *
   * @param {{description: string, value: number, date: Date|string, categoryId: string}} data
   * @returns {Promise<object>} Transação criada (já com a categoria expandida).
   */
  const addTransaction = useCallback(async (data) => {
    const created = await api.createTransaction(data);
    setTransactions((prev) => [created, ...prev]);
    return created;
  }, []);

  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Atualiza uma transação existente no servidor e no estado local.
   *
   * @param {string} id - id (cuid) da transação.
   * @param {object} data - Dados atualizados da transação.
   * @returns {Promise<object>} Transação atualizada.
   */
  const updateTransaction = useCallback(async (id, data) => {
    const updated = await api.updateTransaction(id, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  /**
   * Cria uma nova categoria no servidor e adiciona-a ao estado local.
   *
   * @param {{name: string, displayName: string, icon: string, background: string, isIncome?: boolean}} data
   * @returns {Promise<object>} Categoria criada.
   */
  const addCategory = useCallback(async (data) => {
    const created = await api.createCategory(data);
    setCategories((prev) =>
      [...prev, created].sort((a, b) => a.displayName.localeCompare(b.displayName))
    );
    return created;
  }, []);

  /**
   * Exclui uma categoria no servidor e remove-a do estado local.
   * Categorias padrão (`isDefault`) são bloqueadas pelo back-end.
   *
   * @param {string} id - id (cuid) da categoria.
   * @returns {Promise<void>}
   */
  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    await AsyncStorage.setItem("@auth_token", data.token);
    await AsyncStorage.setItem("@auth_user", JSON.stringify(data.user));
    setAuthToken(data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    await AsyncStorage.setItem("@auth_token", data.token);
    await AsyncStorage.setItem("@auth_user", JSON.stringify(data.user));
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@auth_token");
    await AsyncStorage.removeItem("@auth_user");
    setAuthToken(null);
    setUser(null);
    setTransactions([]);
    setCategories([]);
  };

  return (
    <MoneyContext.Provider
      value={{
        user,
        transactions,
        categories,
        loading,
        error,
        refresh,
        addTransaction,
        removeTransaction,
        updateTransaction,
        addCategory,
        removeCategory,
        login,
        register,
        logout,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
}
