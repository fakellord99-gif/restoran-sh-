import React, { useState, useEffect, useRef } from 'react'

export default function Delivery({ order, onOrderSubmit, onBack }) {
  const [address, setAddress] = useState('')
  const [foundAddress, setFoundAddress] = useState('')
  const [coordinates, setCoordinates] = useState([55.7558, 37.6173]) // Москва по умолчанию [широта, долгота]
  const [zoom, setZoom] = useState(15)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const addressInputRef = useRef(null)
  const checkYmapsIntervalRef = useRef(null)
  const functionsRef = useRef({})
  const isMountedRef = useRef(true)
  const suggestionsRef = useRef([])

  // Инициализация функций в refs
  useEffect(() => {
    // Обратный геокодинг (координаты -> адрес)
    functionsRef.current.reverseGeocode = (coords) => {
      try {
        if (!window.ymaps || !isMountedRef.current) return

        window.ymaps.geocode(coords).then((res) => {
          try {
            if (!isMountedRef.current) return
            const firstGeoObject = res.geoObjects.get(0)
            if (firstGeoObject) {
              const addr = firstGeoObject.getAddressLine()
              if (isMountedRef.current) {
                setFoundAddress(addr)
                setAddress(addr)
              }
            }
          } catch (error) {
            if (isMountedRef.current) {
              console.error('Ошибка при обработке результата обратного геокодинга:', error)
            }
          }
        }).catch((error) => {
          if (isMountedRef.current) {
            console.error('Ошибка обратного геокодинга:', error)
          }
        })
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Ошибка в функции reverseGeocode:', error)
        }
      }
    }

    // Поиск подсказок адресов
    functionsRef.current.searchSuggestions = (addressToSearch) => {
      try {
        if (!isMountedRef.current || !addressToSearch || !addressToSearch.trim() || addressToSearch.trim().length < 2) {
          if (isMountedRef.current) {
            setSuggestions([])
            setShowSuggestions(false)
          }
          return
        }
        
        if (!window.ymaps) return

        window.ymaps.geocode(addressToSearch, { results: 5 }).then((res) => {
          try {
            if (!isMountedRef.current) return
            
            const geoObjects = res.geoObjects.toArray()
            const newSuggestions = geoObjects.map((geoObject, index) => {
              const coords = geoObject.geometry.getCoordinates()
              const addr = geoObject.getAddressLine()
              const name = geoObject.properties.get('name') || addr
              
              return {
                id: index,
                address: addr,
                name: name,
                coordinates: coords,
                description: geoObject.properties.get('description') || ''
              }
            })
            
            if (isMountedRef.current) {
              suggestionsRef.current = newSuggestions
              setSuggestions(newSuggestions)
              setShowSuggestions(newSuggestions.length > 0)
            }
          } catch (error) {
            if (isMountedRef.current) {
              console.error('Ошибка при обработке подсказок:', error)
            }
          }
        }).catch((error) => {
          if (isMountedRef.current) {
            console.error('Ошибка при поиске подсказок:', error)
          }
        })
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Ошибка в функции searchSuggestions:', error)
        }
      }
    }

    // Поиск адреса и перемещение карты на эту точку
    functionsRef.current.searchAndMoveToAddress = (addressToSearch, coordsToUse = null) => {
      try {
        if (!isMountedRef.current) return
        
        if (!addressToSearch || !addressToSearch.trim()) {
          if (isMountedRef.current) setIsSearching(false)
          return
        }
        
        if (!window.ymaps || !mapInstanceRef.current?.map || !markerRef.current) {
          if (isMountedRef.current) setIsSearching(false)
          return
        }

        if (isMountedRef.current) {
          setIsSearching(true)
          setShowSuggestions(false)
        }

        // Если координаты уже известны (из подсказки), используем их
        if (coordsToUse && Array.isArray(coordsToUse) && coordsToUse.length >= 2) {
          if (isMountedRef.current) {
            setCoordinates(coordsToUse)
            setFoundAddress(addressToSearch)
            setZoom(15)

            // Перемещаем карту на адрес с анимацией
            if (mapInstanceRef.current.map && typeof mapInstanceRef.current.map.setCenter === 'function') {
              mapInstanceRef.current.map.setCenter(coordsToUse, 15, {
                duration: 400,
                timingFunction: 'ease-out'
              })
            }
            
            // Обновляем маркер
            if (markerRef.current && typeof markerRef.current.geometry.setCoordinates === 'function') {
              markerRef.current.geometry.setCoordinates(coordsToUse)
              markerRef.current.properties.set({
                balloonContent: `<div style="padding: 10px;"><strong>Адрес доставки:</strong><br/>${addressToSearch}</div>`,
                iconCaption: addressToSearch.length > 30 ? addressToSearch.substring(0, 30) + '...' : addressToSearch
              })
              
              // Открываем балун с адресом
              setTimeout(() => {
                if (markerRef.current && typeof markerRef.current.balloon.open === 'function') {
                  markerRef.current.balloon.open()
                }
              }, 450)
            }
            setIsSearching(false)
          }
          return
        }

        // Иначе ищем через геокодинг
        window.ymaps.geocode(addressToSearch).then((res) => {
          try {
            if (!isMountedRef.current) {
              setIsSearching(false)
              return
            }
            
            const firstGeoObject = res.geoObjects.get(0)
            if (firstGeoObject && mapInstanceRef.current?.map && markerRef.current) {
              const coords = firstGeoObject.geometry.getCoordinates()
              const foundAddr = firstGeoObject.getAddressLine()
              
              if (coords && Array.isArray(coords) && coords.length >= 2 && isMountedRef.current) {
                setCoordinates(coords)
                setFoundAddress(foundAddr)
                setZoom(15)

                // Перемещаем карту на адрес с анимацией
                if (mapInstanceRef.current.map && typeof mapInstanceRef.current.map.setCenter === 'function') {
                  mapInstanceRef.current.map.setCenter(coords, 15, {
                    duration: 400,
                    timingFunction: 'ease-out'
                  })
                }
                
                // Обновляем маркер
                if (markerRef.current && typeof markerRef.current.geometry.setCoordinates === 'function') {
                  markerRef.current.geometry.setCoordinates(coords)
                  markerRef.current.properties.set({
                    balloonContent: `<div style="padding: 10px;"><strong>Адрес доставки:</strong><br/>${foundAddr}</div>`,
                    iconCaption: foundAddr.length > 30 ? foundAddr.substring(0, 30) + '...' : foundAddr
                  })
                  
                  // Открываем балун с адресом
                  setTimeout(() => {
                    if (markerRef.current && typeof markerRef.current.balloon.open === 'function') {
                      markerRef.current.balloon.open()
                    }
                  }, 450)
                }
              }
            }
            if (isMountedRef.current) setIsSearching(false)
          } catch (error) {
            if (isMountedRef.current) {
              console.error('Ошибка при обработке результата геокодинга:', error)
              setIsSearching(false)
            }
          }
        }).catch((error) => {
          if (isMountedRef.current) {
            console.error('Ошибка при поиске адреса:', error)
            setIsSearching(false)
          }
        })
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Ошибка в функции searchAndMoveToAddress:', error)
          setIsSearching(false)
        }
      }
    }
  }, [])

  // Инициализация карты
  useEffect(() => {
    const initMap = () => {
      try {
        if (!mapRef.current || mapInstanceRef.current?.map) {
          return
        }

        if (!window.ymaps) {
          console.warn('Yandex Maps API еще не загружен')
          return
        }

        if (typeof window.ymaps.ready !== 'function') {
          console.warn('Yandex Maps API еще не готов')
          return
        }

        if (!window.ymaps.Map) {
          console.warn('Yandex Maps Map класс еще не готов')
          return
        }

        // Создаем карту
        const map = new window.ymaps.Map(mapRef.current, {
          center: coordinates,
          zoom: zoom,
          controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
        })

        if (!window.ymaps.Placemark) {
          console.warn('Yandex Maps Placemark еще не готов')
          return
        }

        // Создаем маркер
        const marker = new window.ymaps.Placemark(
          coordinates,
          {
            balloonContent: foundAddress || 'Адрес доставки',
            iconCaption: foundAddress || 'Точка доставки'
          },
          {
            preset: 'islands#redDeliveryIcon',
            draggable: true
          }
        )

        // Обработчик перемещения маркера
        marker.events.add('dragend', () => {
          try {
            const coords = marker.geometry.getCoordinates()
            setCoordinates(coords)
            if (functionsRef.current.reverseGeocode) {
              functionsRef.current.reverseGeocode(coords)
            }
          } catch (error) {
            console.error('Ошибка при перемещении маркера:', error)
          }
        })

        // Обработчик клика на карте
        map.events.add('click', (e) => {
          try {
            const coords = e.get('coords')
            setCoordinates(coords)
            marker.geometry.setCoordinates(coords)
            if (functionsRef.current.reverseGeocode) {
              functionsRef.current.reverseGeocode(coords)
            }
          } catch (error) {
            console.error('Ошибка при клике на карте:', error)
          }
        })

        map.geoObjects.add(marker)
        mapInstanceRef.current = {
          map: map,
          marker: marker
        }
        markerRef.current = marker
        setMapLoaded(true)
      } catch (error) {
        console.error('Ошибка при инициализации карты:', error)
        setMapLoaded(false)
      }
    }

    const loadMap = () => {
      try {
        // Проверяем наличие API
        if (window.ymaps && typeof window.ymaps.ready === 'function') {
          try {
            window.ymaps.ready(() => {
              try {
                // Дополнительная проверка перед инициализацией
                if (window.ymaps && window.ymaps.Map && mapRef.current && !mapInstanceRef.current?.map) {
                  initMap()
                }
              } catch (error) {
                console.error('Ошибка в ymaps.ready callback:', error)
              }
            })
          } catch (error) {
            console.error('Ошибка при вызове ymaps.ready:', error)
          }
        } else {
          // Если API еще не загружен, ждем
          let attempts = 0
          const maxAttempts = 50 // максимум 5 секунд
          
          checkYmapsIntervalRef.current = setInterval(() => {
            attempts++
            if (window.ymaps && typeof window.ymaps.ready === 'function') {
              if (checkYmapsIntervalRef.current) {
                clearInterval(checkYmapsIntervalRef.current)
                checkYmapsIntervalRef.current = null
              }
              try {
                window.ymaps.ready(() => {
                  try {
                    // Дополнительная проверка перед инициализацией
                    if (window.ymaps && window.ymaps.Map && mapRef.current && !mapInstanceRef.current?.map) {
                      initMap()
                    }
                  } catch (error) {
                    console.error('Ошибка в ymaps.ready callback:', error)
                  }
                })
              } catch (error) {
                console.error('Ошибка при вызове ymaps.ready:', error)
              }
            } else if (attempts >= maxAttempts) {
              if (checkYmapsIntervalRef.current) {
                clearInterval(checkYmapsIntervalRef.current)
                checkYmapsIntervalRef.current = null
              }
              console.error('Не удалось загрузить Yandex Maps API за 5 секунд')
            }
          }, 100)
        }
      } catch (error) {
        console.error('Ошибка при загрузке карты:', error)
      }
    }

    // Небольшая задержка перед попыткой загрузки карты
    const timeoutId = setTimeout(() => {
      loadMap()
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      isMountedRef.current = false
      if (checkYmapsIntervalRef.current) {
        clearInterval(checkYmapsIntervalRef.current)
        checkYmapsIntervalRef.current = null
      }
      if (mapInstanceRef.current?.map) {
        try {
          mapInstanceRef.current.map.destroy()
        } catch (e) {
          // Игнорируем ошибки при уничтожении
        }
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Обновление карты при изменении координат
  useEffect(() => {
    if (mapInstanceRef.current?.map && markerRef.current && mapLoaded) {
      markerRef.current.geometry.setCoordinates(coordinates)
      markerRef.current.properties.set({
        balloonContent: foundAddress || address || 'Адрес доставки',
        iconCaption: foundAddress || address || 'Точка доставки'
      })
    }
  }, [coordinates, foundAddress, address, mapLoaded])

  // Прямой геокодинг (адрес -> координаты)
  const handleSearch = async () => {
    try {
      if (!address.trim()) {
        alert('Пожалуйста, введите адрес')
        return
      }

      if (!window.ymaps || !mapLoaded || !mapInstanceRef.current?.map || !markerRef.current) {
        alert('Карта еще загружается, подождите немного')
        return
      }

      // Очищаем автоматический поиск если он активен
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = null
      }

      if (functionsRef.current.searchAndMoveToAddress) {
        functionsRef.current.searchAndMoveToAddress(address)
      }
    } catch (error) {
      console.error('Ошибка в handleSearch:', error)
      alert('Произошла ошибка при поиске адреса. Попробуйте еще раз.')
    }
  }

  // Автоматический поиск подсказок и перемещение карты при вводе адреса
  useEffect(() => {
    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }

    if (!address.trim()) {
      setFoundAddress('')
      setIsSearching(false)
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Если адрес не пустой и карта загружена
    if (address.trim().length >= 2 && mapLoaded && window.ymaps) {
      // Сначала ищем подсказки
      if (functionsRef.current.searchSuggestions) {
        functionsRef.current.searchSuggestions(address.trim())
      }

      // Если адрес достаточно длинный (от 3 символов), также перемещаем карту
      if (address.trim().length >= 3 && mapInstanceRef.current?.map && markerRef.current) {
        setIsSearching(true)
        searchTimeoutRef.current = setTimeout(() => {
          try {
            // Проверяем, что пользователь не выбирает из подсказок и все объекты на месте
            if (
              addressInputRef.current === document.activeElement && 
              functionsRef.current.searchAndMoveToAddress &&
              mapInstanceRef.current?.map &&
              markerRef.current &&
              window.ymaps
            ) {
              functionsRef.current.searchAndMoveToAddress(address.trim())
            } else {
              setIsSearching(false)
            }
          } catch (error) {
            console.error('Ошибка при автоматическом поиске адреса:', error)
            setIsSearching(false)
          }
        }, 600)
      }
    }

    // Очистка таймера при размонтировании
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = null
      }
    }
  }, [address, mapLoaded])

  const handleAddressChange = (e) => {
    setAddress(e.target.value)
    setSelectedSuggestionIndex(-1)
  }

  const handleSuggestionSelect = (suggestion) => {
    setAddress(suggestion.address)
    setFoundAddress(suggestion.address)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    
    // Сразу перемещаем карту на выбранный адрес
    if (functionsRef.current.searchAndMoveToAddress && suggestion.coordinates) {
      functionsRef.current.searchAndMoveToAddress(suggestion.address, suggestion.coordinates)
    }
  }

  const handleKeyPress = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      // Навигация по подсказкам стрелками
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex])
        } else if (suggestions.length > 0) {
          // Выбираем первую подсказку
          handleSuggestionSelect(suggestions[0])
        } else {
          handleSearch()
        }
        return
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false)
        return
      }
    }
    
    // При нажатии Enter сразу ищем адрес
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = null
      }
      handleSearch()
    }
  }

  const handleInputBlur = () => {
    // Закрываем подсказки с небольшой задержкой, чтобы успел сработать клик
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalAddress = foundAddress || address
    
    if (!finalAddress || !finalAddress.trim()) {
      alert('Пожалуйста, укажите адрес доставки')
      return
    }
    
    // Показываем маркер на карте
    if (markerRef.current && mapInstanceRef.current?.map) {
      markerRef.current.balloon.open()
      mapInstanceRef.current.map.setCenter(coordinates, 16)
    }
    
    // Создаем финальный заказ с адресом доставки
    const finalOrder = {
      ...order,
      delivery: {
        address: finalAddress,
        coordinates: coordinates,
        foundAddress: foundAddress
      },
      status: 'confirmed',
      deliveryDate: new Date().toISOString()
    }
    
    if (onOrderSubmit) {
      onOrderSubmit(finalOrder)
    } else {
      alert(`Заказ оформлен!\n\nАдрес доставки: ${finalAddress}\n\nМы свяжемся с вами для подтверждения!`)
    }
  }

  const calculateTotal = () => {
    if (!order || !order.items) return 0
    let total = 0
    order.items.forEach(item => {
      const quantity = item.quantity || 1
      total += parseFloat(item.price) * quantity
    })
    return total
  }

  return (
    <div className="page-content">
      <div className="delivery-header">
        <h1>Доставка</h1>
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            ← Назад
          </button>
        )}
      </div>
      <div className="delivery-content">
        <div className="delivery-form-section">
          <h2>Укажите адрес доставки</h2>
          <form className="delivery-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="address">Адрес доставки</label>
              <div className="address-input-wrapper">
                <div className="address-input-group">
                  <input
                    ref={addressInputRef}
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={handleAddressChange}
                    onKeyDown={handleKeyPress}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="Введите адрес (например: Москва, Красная площадь)"
                    className="address-input"
                    autoComplete="off"
                  />
                  {isSearching && (
                    <span className="searching-indicator">Поиск...</span>
                  )}
                  {address && (
                    <button 
                      type="button" 
                      className="clear-btn"
                      onClick={() => {
                        setAddress('')
                        setFoundAddress('')
                        setSuggestions([])
                        setShowSuggestions(false)
                        addressInputRef.current?.focus()
                      }}
                      title="Очистить"
                    >
                      ×
                    </button>
                  )}
                  <button 
                    type="button" 
                    className="search-btn"
                    onClick={handleSearch}
                  >
                    Найти
                  </button>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="address-suggestions">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      >
                        <div className="suggestion-main">
                          <span className="suggestion-address">{suggestion.name}</span>
                        </div>
                        {suggestion.description && (
                          <div className="suggestion-description">{suggestion.description}</div>
                        )}
                        <div className="suggestion-arrow">→</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="map-hint">
                Введите адрес и нажмите "Найти" или Enter - карта автоматически переместится на найденную точку.<br/>
                Можно ввести адрес в любом городе России и мира. При вводе адреса (от 3 символов) поиск выполняется автоматически.
              </p>
            </div>

            {foundAddress && (
              <div className="found-address">
                <strong>Адрес доставки:</strong>
                <p>{foundAddress}</p>
              </div>
            )}

            {order && (
              <div className="order-summary-delivery">
                <h3>Ваш заказ</h3>
                <div className="order-items-mini">
                  {order.items.map(item => {
                    const quantity = item.quantity || 1
                    return (
                      <div key={item.id} className="order-item-mini">
                        <span>{item.title} × {quantity}</span>
                        <span>{(parseFloat(item.price) * quantity).toFixed(0)}₽</span>
                      </div>
                    )
                  })}
                </div>
                <div className="order-total-mini">
                  <strong>Итого: {calculateTotal().toFixed(0)}₽</strong>
                </div>
              </div>
            )}

            <button type="submit" className="delivery-submit">
              Оформить заказ
            </button>
          </form>
        </div>

        <div className="map-section">
          <h2>Карта доставки</h2>
          <div className="yandex-map-container">
            <div 
              ref={mapRef} 
              className="yandex-map"
              style={{ width: '100%', height: '600px' }}
            ></div>
            {!mapLoaded && (
              <div className="map-loading">
                <p>Загрузка карты...</p>
              </div>
            )}
          </div>
          <div className="map-instructions">
            <h3>Как выбрать адрес доставки:</h3>
            <ol>
              <li>Введите адрес в поле выше и нажмите "Найти" или Enter</li>
              <li>При вводе адреса (от 3 символов) карта автоматически переместится на найденную точку</li>
              <li>Или кликните на карте в нужном месте - адрес определится автоматически</li>
              <li>Или перетащите красный маркер на карте в нужное место</li>
              <li><strong>Красный маркер показывает место доставки вашего заказа</strong></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}


