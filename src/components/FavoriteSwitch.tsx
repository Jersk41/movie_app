import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Movie } from '../types/app'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Props {
  movie: Movie
}

type iconStyle = {
  true: {
    name: 'heart' | 'heart-o'
    color: 'pink'
  }
  false: {
    name: 'heart' | 'heart-o'
    color: 'grey'
  }
}

const FavoriteSwitch = ({ movie }: Props): React.JSX.Element => {
  const [isFavorite, setIsFavorite] = useState(false)
  const iconStyle: iconStyle = {
    true: {
      name: 'heart',
      color: 'pink',
    },
    false: {
      name: 'heart-o',
      color: 'grey',
    },
  }
  const icon = isFavorite ? iconStyle['true'] : iconStyle['false']

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      let favMovieList: Movie[] = []
      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie]
      } else {
        favMovieList = [movie]
      }
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(true)
    } catch (error) {
      console.error(error)
    }
  }

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      const favMovieList: Movie[] = JSON.parse(initialData).filter(
        (item) => item.id !== id,
      )
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(false)
    } catch (error) {
      console.error(error)
    }
  }

  const checkIsFavorite = async (id: number): Promise<boolean> => {
    const initialData = await AsyncStorage.getItem('@FavoriteList')
    const data: Movie[] = JSON.parse(initialData)
    return data.some((item) => item.id === id)
  }

  useEffect(() => {
    checkIsFavorite(movie.id)
      .then((cond) => setIsFavorite(cond))
      .catch((err) => console.error(err))
  }, [])

  return (
    <TouchableOpacity
      onPress={() => {
        if (isFavorite) {
          removeFavorite(movie.id)
        } else {
          addFavorite(movie)
        }
      }}
    >
      <FontAwesome name={icon.name} size={24} color={icon.color} />
    </TouchableOpacity>
  )
}

export default FavoriteSwitch
