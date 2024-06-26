import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import type { MovieListProps, Movie } from '../../types/app'
import { API_ACCESS_TOKEN } from '@env'
import MovieItem from './MovieItem'

const MovieList = ({
  title,
  path,
  coverType,
}: MovieListProps): React.JSX.Element => {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    getMovieList()
  }, [])

  const getMovieList = (): void => {
    const url = `https://api.themoviedb.org/3/${path}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }
    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovies(response.results)
      })
      .catch((errorResponse) => {
        console.error(errorResponse)
      })
  }

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.purpleLabel}></View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {movies.length !== 0 ? (
        <FlatList
          style={{
            ...styles.movieList,
            maxHeight: coverImageSize[coverType].height,
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={movies}
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              size={coverImageSize[coverType]}
              coverType={coverType}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text
          style={styles.notFoundText}
        >{`No ${title.toLowerCase()} founded :'(`}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginLeft: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  movieList: {
    paddingLeft: 4,
    marginTop: 8,
  },
  notFoundText: {
    color: 'darkred',
    fontSize: 20,
    display: 'flex',
    alignSelf: 'center',
    marginTop: 24,
  },
})

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
}

export default MovieList
