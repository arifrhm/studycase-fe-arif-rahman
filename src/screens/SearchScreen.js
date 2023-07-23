import React, { useEffect, useReducer } from 'react';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const SearchScreen = () => {
  const initialState = {
    loading: true,
    error: '',
    data: [], // Renamed 'results' to 'data' for consistency
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, data: action.payload?.data?.data , error:null}; // Renamed 'results' to 'data'
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload , data:null};
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log('data');
    const fetchData = async () => {
      try {
        const response = await axios.get(`/products/search?query=${searchParams.get('query')}`);
        const data = response.data;
        dispatch({ type: 'FETCH_SUCCESS', payload: { data } });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: 'Error fetching search results.' });
      }
    };

    fetchData();
  }, [searchParams.get('query')]);

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
