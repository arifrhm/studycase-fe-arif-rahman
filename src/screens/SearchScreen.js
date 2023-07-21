import React, { useEffect, useReducer, useCallback } from 'react';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';

const SearchScreen = () => {
  const initialState = {
    loading: true,
    error: '',
    data: [], // Renamed 'results' to 'data' for consistency
  };

  const searchParams = new URLSearchParams(document.location.search);
  const query = searchParams.get('query');

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, data: action.payload.data }; // Renamed 'results' to 'data'
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/products/search?query=${query}`); // Destructure 'data' directly
      dispatch({ type: 'FETCH_SUCCESS', payload: { data } });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: 'Error fetching search results.' });
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Include fetchData in the dependency array

  const { loading, error, data } = state; // Destructure 'data' directly

  return (
    <div>
      <h1>Search Results</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="search-results">
          {data?.length ? (
            data.map((result) => (
              <div key={result._id} className="search-result">
                <img src={`/uploads/products/${result.image}`} alt={result.name} />
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
