import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import styles from './style/Global';
import Sobre from './screens/Sobre';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator as NavegacaoTab } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal } from 'react-native';

const CadastrarProduto = ({
  adicionarNota,
  updateTask,
  taskText,
  setTaskText,
  taskQuantity,
  setTaskQuantity: adicionarQuantidade,
  taskCostPrice,
  setTaskCostPrice: adicionarPreco,
  taskSellPrice,
  setTaskSellPrice: adicionarPrecoVenda,
  taskDescription,
  setTaskDescription,
  isEditing,
  currentTaskId,
}) => {
  const [mensagemErro, adicionaMsgErro] = useState('');

  const salvar = () => {
    adicionaMsgErro('');

    const quantity = taskQuantity.replace(',', '.');
    const costPrice = taskCostPrice.replace(',', '.');
    const sellPrice = taskSellPrice.replace(',', '.');

    if (
      !taskText.trim() ||
      !quantity.trim() ||
      !costPrice.trim() ||
      !sellPrice.trim()
    ) {
      adicionaMsgErro(
        '*Nome do produto, quantidade, preço de compra e preço de venda são obrigatórios.'
      );
      return;
    }

    if (isNaN(quantity) || isNaN(costPrice) || isNaN(sellPrice)) {
      adicionaMsgErro(
        '*Quantidade, preço de compra e preço de venda devem ser números válidos.'
      );
      return;
    }

    if (isEditing) {
      updateTask(currentTaskId);
    } else {
      adicionarNota();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? 'Editar Produto' : 'Cadastrar Produto'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={taskText}
        onChangeText={setTaskText}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={taskQuantity}
        onChangeText={(value) => adicionarQuantidade(value.replace(',', '.'))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço de compra"
        value={taskCostPrice}
        onChangeText={(value) => adicionarPreco(value.replace(',', '.'))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço de venda"
        value={taskSellPrice}
        onChangeText={(value) => adicionarPrecoVenda(value.replace(',', '.'))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={taskDescription}
        onChangeText={setTaskDescription}
      />

      {mensagemErro ? (
        <Text style={styles.errorText}>{mensagemErro}</Text>
      ) : null}

      <Button
        title={isEditing ? 'Salvar' : 'Adicionar Produto'}
        onPress={salvar}
        color="#28a741"
      />
    </View>
  );
};

//Exibir Produtos Cadastrados
const ProdutosCadastrados = ({
  tasks,
  deleteTask: deletarNota,
  editarNota: editarNota,
  estoque,
  navigation,
}) => {
  const [searchText, procurar] = useState('');
  const [isModalVisible, visivel] = useState(false);
  const [paraDeletar, adicionarDeletar] = useState(null); // armazenar o produto que  será excluído

  const filteredTasks = tasks
    .filter((task) =>
      task.text.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // mais recente
    .reverse();

  // Cálculo
  const totalCostPrice = filteredTasks.reduce(
    (acc, task) =>
      acc +
      parseFloat(task.costPrice.replace(',', '.')) *
        parseFloat(task.quantity.replace(',', '.')),
    0
  );
  const totalVendido = filteredTasks.reduce(
    (acc, task) => acc + parseFloat(task.sellPrice) * parseFloat(task.quantity),
    0
  );
  const totalProfit = totalVendido - totalCostPrice;

  const mostrarDeletados = (task) => {
    adicionarDeletar(task);
    visivel(true);
  };

  const handleDelete = () => {
    if (paraDeletar) {
      deletarNota(paraDeletar.id);
    }
    visivel(false);
    adicionarDeletar(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Cadastrados</Text>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar produto"
        value={searchText}
        onChangeText={procurar}
      />
      <FlatList
        data={filteredTasks}
        extrairId={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.tTexto}>Nome: {item.text}</Text>
            <Text style={styles.tTexto}>Quantidade: {item.quantity}</Text>
            <Text style={styles.tTexto}>
              Preço de compra: R${' '}
              {parseFloat(item.costPrice).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.tTexto}>
              Total em compras: R${' '}
              {parseFloat(item.costPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tTexto}>
              Preço de venda: R${' '}
              {parseFloat(item.sellPrice).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.tTexto}>
              Lucro por unidade: R${' '}
              {(
                parseFloat(item.sellPrice) - parseFloat(item.costPrice)
              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tTexto}>
              Total estimado em vendas: R${' '}
              {parseFloat(item.sellPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tTexto}>
              Lucro total estimado: R${' '}
              {parseFloat((item.sellPrice - item.costPrice)*item.quantity).toFixed(2)}
            </Text>
            {item.description && (
  <Text style={styles.tTexto}>Descrição: {item.description}</Text>
)}
            <Text style={styles.tTexto}>Criado em: {item.createdAt}</Text>
            {item.updatedAt && (
              <Text style={styles.tTexto}>Editado em: {item.updatedAt}</Text>
            )}
            <View style={styles.actions}>
              {/* Botão Editar */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  editarNota(item);
                  navigation.navigate('Cadastrar');
                }}>
                <Icon name="edit" size={20} color="#4CAF50" /> {/*edição */}
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>

              {/* Botão Excluir */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => mostrarDeletados(item)}>
                <Icon name="delete" size={20} color="#F44336" /> {/*exclusão */}
                <Text style={styles.botaoDeletar}>Excluir</Text>
              </TouchableOpacity>

              {/* Botão Estoque */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => estoque(item)}>
                <Icon name="add-box" size={20} color="#FF9800" />
                <Text style={styles.vendaBotao}>Estoque</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>
          Total em compras: R${' '}
          {totalCostPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.totalTexto}>
          Total estimado em vendas: R${' '}
          {totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.totalTexto}>
          Total de lucro estimado: R${' '}
          {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          
        </Text>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => visivel(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Tem certeza que deseja excluir este produto?
            </Text>
            <View style={styles.modalActions}>
              <Button title="Cancelar" onPress={() => visivel(false)} />
              <Button title="Excluir" onPress={handleDelete} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

//Pesquisa
const ProdutosEstoque = ({ soldTasks, deleteSoldTask: deletarEstoque }) => {
  const [searchText, setSearchText] = useState('');

  const filtrarProdutosEstoque = soldTasks
    .filter((task) =>
      task.text.toLowerCase().includes(searchText.toLowerCase())
    )
    .reverse();

  // Cálculo
  const totalCostPrice = filtrarProdutosEstoque.reduce(
    (acc, task) => acc + parseFloat(task.costPrice) * parseFloat(task.quantity),
    0
  );
  const totalVendido = filtrarProdutosEstoque.reduce(
    (acc, task) => acc + parseFloat(task.sellPrice) * parseFloat(task.quantity),
    0
  );
  const totalProfit = totalVendido - totalCostPrice;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos no Estoque</Text>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar produto"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filtrarProdutosEstoque}
        extrairId={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.tTexto}>Nome: {item.text}</Text>
            <Text style={styles.tTexto}>Quantidade: {item.quantity}</Text>
            <Text style={styles.tTexto}>
              Preço de compra: R$ {parseFloat(item.costPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tTexto}>
              Total em compras: R${' '}
              {parseFloat(item.costPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tTexto}>
              Preço de venda: R$ {parseFloat(item.sellPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tTexto}>
              Lucro por unidade: R${' '}
              {(
                parseFloat(item.sellPrice) - parseFloat(item.costPrice)
              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.tTexto}>
              Total estimado em vendas: R${' '}
              {parseFloat(item.sellPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
             <Text style={styles.tTexto}>
              Lucro total estimado: R${' '}
              {parseFloat((item.sellPrice - item.costPrice)*item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            {item.description && (
  <Text style={styles.tTexto}>Descrição: {item.description}</Text>
)}
            <Text style={styles.tTexto}>Adicionado em: {item.soldAt}</Text>
            <TouchableOpacity
              style={[styles.actionButton, { marginTop: 10 }]}
              onPress={() => deletarEstoque(item.id)}>
              <Icon name="delete" size={20} color="#F44336" />
              <Text style={styles.botaoDeletar}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>
          Total em compras: R${' '}
          {totalCostPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.totalTexto}>
          Total estimado em vendas: R${' '}
          {totalVendido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.totalTexto}>
          Total de lucro estimado: R${' '}
          {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
};
// Navegação por Abas
const Tab = NavegacaoTab();

const ProdutosTabs = () => {
  const [notas, adicionarNotas] = useState([]);
  const [notasVendidas, adicionarNotaVendida] = useState([]);
  const [taskText, adicionarTextoNota] = useState('');
  const [taskQuantity, adicionarQuantidade] = useState('');
  const [taskCostPrice, AdicionarPreco] = useState('');
  const [taskSellPrice, adicionarPrecodeVenda] = useState('');
  const [taskDescription, adicionarDescricao] = useState('');
  const [isEditing, editar] = useState(false);
  const [currentTaskId, adicionarId] = useState(null);

  useEffect(() => {
    const carregarNotas = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) adicionarNotas(JSON.parse(storedTasks));

      const storedSoldTasks = await AsyncStorage.getItem('soldTasks');
      if (storedSoldTasks) adicionarNotaVendida(JSON.parse(storedSoldTasks));
    };
    carregarNotas();
  }, []);

  const salvarNotas = async (newTasks) => {
    adicionarNotas(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const salvarNotaVendida = async (newSoldTasks) => {
    adicionarNotaVendida(newSoldTasks);
    await AsyncStorage.setItem('soldTasks', JSON.stringify(newSoldTasks));
  };

  const adicionarNota = () => {
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      quantity: taskQuantity.replace(',', '.'),
      costPrice: taskCostPrice.replace(',', '.'),
      sellPrice: taskSellPrice.replace(',', '.'),
      description: taskDescription,
      createdAt: new Date().toLocaleString(),
    };

    salvarNotas([...notas, newTask]);
    adicionarTextoNota('');
    adicionarQuantidade('');
    AdicionarPreco('');
    adicionarPrecodeVenda('');
    adicionarDescricao('');
  };

  const deleteTask = (id) =>
    salvarNotas(notas.filter((task) => task.id !== id));

  const editarNota = (task) => {
    adicionarTextoNota(task.text);
    adicionarQuantidade(task.quantity);
    AdicionarPreco(task.costPrice);
    adicionarPrecodeVenda(task.sellPrice);
    adicionarDescricao(task.description);
    editar(true);
    adicionarId(task.id);
  };

  const updateTask = (id) => {
    const updatedTasks = notas.map((task) =>
      task.id === id
        ? {
            ...task,
            text: taskText,
            quantity: taskQuantity.replace(',', '.'),
            costPrice: taskCostPrice.replace(',', '.'),
            sellPrice: taskSellPrice.replace(',', '.'),
            description: taskDescription,
            updatedAt: new Date().toLocaleString(),
          }
        : task
    );

    salvarNotas(updatedTasks);
    adicionarTextoNota('');
    adicionarQuantidade('');
    AdicionarPreco('');
    adicionarPrecodeVenda('');
    adicionarDescricao('');
    editar(false);
    adicionarId(null);
  };

  const estoque = (task) => {
    salvarNotas(notas.filter((item) => item.id !== task.id));
    salvarNotaVendida([
      ...notasVendidas,
      { ...task, soldAt: new Date().toLocaleString() },
    ]);
  };

  const deleteSoldTask = (id) =>
    salvarNotaVendida(notasVendidas.filter((task) => task.id !== id));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Cadastrar':
              iconName = 'note-add';
              break;
            case 'Cadastrados':
              iconName = 'check-circle';
              break;
            case 'Estoque':
              iconName = 'inventory';
              break;
            default:
              iconName = 'help'; // Ícone padrão
          }
          // Retorna o ícone fixo
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#008104',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Cadastrar">
        {(props) => (
          <CadastrarProduto
            {...props}
            adicionarNota={adicionarNota}
            updateTask={updateTask}
            taskText={taskText}
            setTaskText={adicionarTextoNota}
            taskQuantity={taskQuantity}
            setTaskQuantity={adicionarQuantidade}
            taskCostPrice={taskCostPrice}
            setTaskCostPrice={AdicionarPreco}
            taskSellPrice={taskSellPrice}
            setTaskSellPrice={adicionarPrecodeVenda}
            taskDescription={taskDescription}
            setTaskDescription={adicionarDescricao}
            isEditing={isEditing}
            currentTaskId={currentTaskId}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Cadastrados">
        {(props) => (
          <ProdutosCadastrados
            {...props}
            tasks={notas}
            deleteTask={deleteTask}
            editarNota={editarNota}
            estoque={estoque}
            navigation={props.navigation}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Estoque">
        {(props) => (
          <ProdutosEstoque
            {...props}
            soldTasks={notasVendidas}
            deleteSoldTask={deleteSoldTask}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Navegação Principal
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Produtos" component={ProdutosTabs} />
        <Drawer.Screen name="Sobre o App" component={Sobre} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

