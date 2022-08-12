import React, {useState, useEffect} from "react";
import addSVG from "../../assets/img/add.svg";
import closeSVG from "../../assets/img/close.svg"
import List from "../List/List";
import Badge from "../Badge/Badge";
import './AddListButton.scss'
import axios from "axios";


const AddButtonList = ({colors, onAdd}) => {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (Array.isArray(colors))
            selectColor(colors[0].id);
    }, [colors]);

    const close = () => {
        setVisiblePopup(false);
        setInputValue('');
        selectColor(colors[0].id);
    }

    const addList = () => {
        if (!inputValue) {
            alert('Введите название папки');
            return;
        }
        setIsLoading(true);

        axios.post('http://localhost:3001/lists', {name: inputValue, colorId: selectedColor}).then(({data}) => {
            const color = colors.filter(c => c.id === selectedColor)[0];
            const listObj = {...data, color, tasks: []};
            onAdd(listObj);
            close();
        }).catch(() => {
            alert('Ошибка при добавлении списка')
        })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className='add-list'>
            <List onClick={() => setVisiblePopup(!visiblePopup)} items={
                [
                    {
                        className: 'list__add-button',
                        icon: <img src={addSVG} alt="add icon"/>,
                        name: 'Добавить папку'
                    }
                ]
            }/>
            {visiblePopup && <div className='add-list__popup'>
                <img onClick={close} src={closeSVG} alt='close button' className='add-list__popup-close-btn'/>
                <input
                    onChange={e => setInputValue(e.target.value)}
                    value={inputValue}
                    className='field'
                    type='text'
                    placeholder='Название папки'/>
                <div className='add-list__popup-colors'>
                    {colors.map(color => (
                        <Badge
                            onClick={() => selectColor(color.id)}
                            key={color.id}
                            color={color.name}
                            className={selectedColor === color.id && 'active'}
                        />
                    ))}
                </div>
                <button onClick={addList} className='button'>{isLoading ? 'Добавление...' : 'Добавить'}</button>
            </div>}
        </div>
    )
}

export default AddButtonList;
