/* src/App.js 
https://docs.amplify.aws/start/getting-started/data-model/q/integration/react/#connect-frontend-to-api
*/

import React, { useEffect, useState } from 'react'
import { Amplify, API, graphqlOperation, Storage } from 'aws-amplify'

import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'

import awsExports from "./aws-exports";

import { withAuthenticator, Button, Heading, Image} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

const initialState = { name: '', description: '', precio: '',image: '' }

function App({signOut, user}) {

  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
   <>
   <div style={styles.container}>
      <h2>Hello {user.username}</h2>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <input
      onChange={event => setInput('precio',event.target.value)}
      style={styles.input}
      value={formState.precio}
      placeholder="Precio"
      />
      <input type="file" onChange={event => setInput('image',event.target.value)} value={formState.image} placeholder='hola image'/>
      <button style={styles.button} onClick={addTodo}>Create Todo</button>

      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
            <p style={styles.todoprecio}>{todo.precio}</p>
            {/* <Image>{todo.image}</Image> */}
          </div>
        ))
      }

    </div>
    <Button
          isFullWidth={true}
          size="large"
          loadingText=""
          onClick={signOut}
          ariaLabel="">     SignOut!!
    </Button>
   
   </>
    
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}
export default withAuthenticator (App);
