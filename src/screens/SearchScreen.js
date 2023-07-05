import React, { useEffect, useReducer } from 'react';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';

export const handleSearch = (dispatch, setQuery, query) => {
  dispatch({ type: 'FETCH_REQUEST' });
  setQuery(query);
};

const SearchScreen = () => {
  const [query] = React.useState('');

  const initialState = {
    loading: true,
    error: '',
    results: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, results: action.payload.data };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/products/search?query=${query}`);
        const data = response.data;
        console.log(data);
        console.log(query);
        dispatch({ type: 'FETCH_SUCCESS', payload: { data } });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: 'Error fetching search results.' });
      }
    };

    fetchData();
  }, [query]);

  const { loading, error, results } = state;

  return (
    <div>
      <h1>Search Results</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="search-results">
          {Array.isArray(results) ? (
            results.map((result) => (
              <div key={result._id} className="search-result">
                <img src={result.image} alt={result.name} />
                <h3>{result.name}</h3>
                <p>{result.description}</p>
                <p>Price: ${result.price}</p>
                <p>Category: {result.category}</p>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
