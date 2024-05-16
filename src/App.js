import logo from './logo.svg';
import './App.css';
import AuthComponent from './components/auth/AuthComponent';
import RegisterComponent from './components/auth/RegisterComponent';



function App() {
  return (
   <div className='App'> 
   <>
<AuthComponent />
   </>
<>
<RegisterComponent />
</>   
  <div className='App_messages'>
    <span>Василий: Привет</span>
    <span>Егор: Привет</span>
    <span>Василий: Как Дела</span>
    <span>Егор: Ок</span>
   
  </div>

  <div className='App_form'>
    <input placeholder='Enter text' />
    <button onChange={()=>alert('Отправлено')}>Отправить</button>
  </div>

   </div>
  );
}

export default App;
