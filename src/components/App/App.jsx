import React from 'react';
import Form from '../form/form';
import ListContact from '../listContacts/listContacts';
import { Filter } from '../filter/filter';
import { Wrapper } from './App.styled';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts } from 'redux/contacts/contact-selectors';
import { getFilter } from 'redux/filter/filter-selectors';
import { addContact, removeContact } from 'redux/contacts/contact-slice';
import { setFilter } from 'redux/filter/filter-slice';

export default function App() {
  const contacts = useSelector(getContacts);
  const filter = useSelector(getFilter);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      localStorage.removeItem('contacts');
    };
  }, []);

  const onAddContact = contact => {
    if (isDuplicate(contact)) {
      return alert(`${contact.name} is already in contacts`);
    }
    const action = addContact(contact);
    dispatch(action);
  };

  const onRemoveContact = id => {
    const action = removeContact(id);
    dispatch(action);
  };

  const handleChange = e => {
    const { value } = e.currentTarget;
    dispatch(setFilter(value));
  };

  const isDuplicate = ({ name }) => {
    const result = contacts.find(item => item.name === name);
    return result;
  };

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }
    const normalizeFilter = filter.toLocaleLowerCase();
    const filterContacts = contacts.filter(({ name }) => {
      const normalizeName = name.toLocaleLowerCase();
      const result = normalizeName.includes(normalizeFilter);
      return result;
    });
    return filterContacts;
  };

  const filteredContacts = getFilteredContacts();

  return (
    <Wrapper>
      <h1>Phonebook</h1>
      <Form onSubmit={onAddContact} />
      <h1>Contacts</h1>
      <Filter value="filter" onChange={handleChange} />
      <ListContact items={filteredContacts} removeContact={onRemoveContact} />
    </Wrapper>
  );
}
