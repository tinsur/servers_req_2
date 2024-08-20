import React, {useEffect, useState} from 'react';
import styles from './App.module.css';

const URL = 'http://localhost:3005/todos/';

function App() {
    const [todos, setTodos] = useState([]) // состояние массива данных
    const [viewForm, setViewForm] = useState(false) //состояние появления формы
    const [dataForm, setDataForm] = useState({ // состояние данных из формы
        id: '',
        title: '',
        completed: false
    })
    const [getTodo, setGetTodo] = useState(true) // флаг для вызова юзэффекта


    //получение данных с сервера
    useEffect(() => {
        fetch(URL)
            .then((loadedData) => loadedData.json())
            .then((loadedTodos) => {
                setTodos(loadedTodos);
            });
    }, [getTodo]);
    const completed = todos.filter((item) => item.completed) // переменная для сделанных
    const unCompleted = todos.filter((item) => !item.completed) // переменная для не сделанных

    // событие отправки формы
    const onSubmit = (e) => {
        e.preventDefault();
        const data = {...dataForm}; //промежуточная переменная для отправки данных без айди
        delete data.id; //удаление айди
        let url = '', method = '';
        //условие для определения добавить или редактировать данные
        if (dataForm.id !== '') {
            url = URL + dataForm.id;
            method = 'PUT';
        } else {
            url = URL;
            method = 'POST';
        }
        //отправка запроса для добавления или редактирования
        fetch(url, {
            method: method, //метод запроса для определения действия: добавить или редактировать
            headers: {'Content-Type': 'application/json;charset=utf-8'},// заголовки для сервера, указывают тип контента и кодировку
            body: JSON.stringify(data),// тело запроса в котором данные конвертируются в JSON строку

        })
            .then((rawResponse) => rawResponse.json())
            .then((response) => {
                //блок успешного ответа
                setViewForm(false);// скрытие формы
                setGetTodo(!getTodo)// смена флага для юзэффекта
                //setRefreshProducts(!refreshProducts);
            })
        // .finally(() => setIsCreating(false));
    }
    //событие изменения title
    const onChangeTitle = (e) => {
        setDataForm({...dataForm, title: e.target.value}) //в состояние устанавливается новое значение title
    }
    //событие изменения checked
    const onChangeCompleted = (e) => {
        setDataForm({...dataForm, completed: e.target.checked})//в состояние устанавливается новое значение чекбокса
    }
//событие клика на кнопку редактировать
    const editTodo = (e) => {
        e.preventDefault();
        setViewForm(true) //открытие формы
        //объект из дата-атрибутов данных
        const data = {
            id: e.target.dataset.id,
            title: e.target.dataset.title,
            completed: (e.target.dataset.completed === 'true') ? true : false
        }
        setDataForm(data)//устанавливаются состояния на основании data
    }
    //событие клика на кнопку добавить
    const addTodo = () => {
        setViewForm(true)
        //обнуление состояния формы
        setDataForm({
            id: '',
            title: '',
            completed: false
        })
    }
    const deleteTodo = (e) => {
        fetch(URL+ e.target.dataset.id, {
            method: 'DELETE',
        })
            .then((rawResponse) => rawResponse.json())
            .then((response) => {
                //блок успешного ответа
                setGetTodo(!getTodo)// смена флага для юзэффекта
            })
    }

return (
    <div className={styles.app}>

        <div className={styles.listWrap}>
            <div className={styles.list}>
                <h2>Сделано</h2>
                {completed.map(({id, title, completed}) => (
                    <div className={styles.todo} key={id}>{title}
                        <div>
                            <button onClick={editTodo} data-id={id} data-title={title} data-completed={completed}>Edit</button>
                            <button data-id={id} onClick={deleteTodo} >Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.list}>
                <h2>Не сделано</h2>
                {unCompleted.map(({id, title, completed}) => (
                    <div className={styles.todo} key={id}>{title}
                        <div>
                            <button onClick={editTodo} data-id={id} data-title={title} data-completed={completed}>Edit</button>
                            <button onClick={deleteTodo} data-id={id}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <button className={styles.addTodo} onClick={addTodo}>Add todo</button>

        {viewForm &&
        <div className={styles.formWrap}>
            <form onSubmit={onSubmit}>
                <input type="hidden" value={dataForm.id}/>
                <input type="text" value={dataForm.title} onChange={onChangeTitle}/>
                <input type="checkbox" checked={dataForm.completed} onChange={onChangeCompleted}/>
                <button type='submit'>Submit</button>
            </form>
        </div>
        }


    </div>
);
}

export default App;
