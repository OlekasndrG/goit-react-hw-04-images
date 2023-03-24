import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as AddIcon } from '../icons/search.svg';
import {
  SearchForm,
  SearchbarContainer,
  SearchButton,
} from './Searchbar.styled';

class Searchbar extends Component {
  state = {
    querySearch: '',
  };
  handleQueryChange = e => {
    this.setState({ querySearch: e.currentTarget.value.toLowerCase() });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.querySearch.trim() === '') {
      alert('pustaya');
      return;
    }
    this.props.onSubmit(this.state.querySearch);
  };

  render() {
    return (
      <SearchbarContainer>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchButton type="submit" aria-label="пошук">
            <AddIcon width="28" height="28" />
          </SearchButton>
          <input
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleQueryChange}
            value={this.state.querySearch}
          />
        </SearchForm>
      </SearchbarContainer>
    );
  }
}

export function SearchBarHook({ onSubmit }) {
  const [querySearch, setQuerySearch] = useState('');
  const handleQueryChange = e => {
    setQuerySearch(e.currentTarget.value.toLowerCase());
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (querySearch.trim() === '') {
      alert('Введіть пошук');
      return;
    }
    onSubmit(querySearch);
  };
  return (
    <SearchbarContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchButton type="submit" aria-label="пошук">
          <AddIcon width="28" height="28" />
        </SearchButton>
        <input
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleQueryChange}
          value={querySearch}
        />
      </SearchForm>
    </SearchbarContainer>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
