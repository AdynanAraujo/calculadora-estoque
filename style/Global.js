import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
  },
 
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  taskContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tTexto: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },

  //Excluir
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  taskContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tTexto: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo 
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  totalContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  totalTexto: {
    fontSize: 14,
    marginBottom: 8,
  },
  
  // Icones 

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  actionButton: {
  
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: 5,
    color: '#4CAF50',
    fontSize: 16,
  },
  botaoDeletar: {
    marginLeft: 5,
    color: '#F44336',
    fontSize: 16,
  },
  vendaBotao: {
    marginLeft: 5,
    color: '#FF9800',
    fontSize: 16,
  }
});


export default styles;