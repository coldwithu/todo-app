import React from "react";
import axios from "axios";
import classNames from "classnames";
import Badge from '../Badge/Badge'
import './List.scss';
import removeSVG from '../../assets/img/remove.svg'

const List = ({items, isRemovable, onClick, onRemove, onClickItem, activeItem}) => {

    const removeItem = (item) => {
        if (window.confirm('Вы действительно хотите удалить папку?')) {
            axios.delete('http://localhost:3001/lists/' + item.id).then(() => {
                onRemove(item.id);
            })

        }
    }
    return (
        <ul onClick={onClick} className="list">
            {items.map((item, index) => (
                <li key={index}
                    className={classNames(item.className, {'active': item.active ? item.active : activeItem && activeItem.id === item.id})}
                    onClick={onClickItem ? () => onClickItem(item) : null}
                >
                    <i>{item.icon ? (item.icon) : (<Badge color={item.color.name}></Badge>)}</i>
                    <span>{item.name}{item.tasks && ` (${item.tasks.length})`}</span>
                    {isRemovable && <img className='list__remove-icon'
                                         src={removeSVG}
                                         alt='remove icon'
                                         onClick={() => removeItem(item)}
                    />}
                </li>
            ))}
        </ul>
    )
}
export default List;