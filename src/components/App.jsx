import React, { useEffect, useState } from 'react';

import { ModalHook } from './Utils/Modal/Modal';

// import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { FetchAPI } from './Utils/Fetch/API';
import Loader from './Loader/Loader';
import { LoadMoreBtn, MainContainer } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchBarHook } from './Searchbar/Searchbar';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};
export default function HookAPP() {
  // const isFirstRender = useRef(true);
  const [querySearch, setQuerySearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [picturesArray, setPicturesArray] = useState([]);
  const [showMoreBTn, setShowMoreBTn] = useState(false);
  const [activeImg, setActiveImg] = useState([]);
  // const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(STATUS.IDLE);

  const innerFetch = (querySearch, page) => {
    if (querySearch === '') {
      return;
    }
    setStatus(STATUS.PENDING);
    FetchAPI(querySearch, page)
      .then(results => {
        setPicturesArray(prev => [...prev, ...results.hits]);
        setStatus(STATUS.RESOLVED);

        if (results.totalHits > 12) {
          setShowMoreBTn(true);
        } else {
          setShowMoreBTn(false);
        }
        if (results.hits.length === 0) {
          setStatus(STATUS.REJECTED);
          setShowMoreBTn(false);
          toast.error(`We didnt find results for ${querySearch}`, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
      })
      .catch(error => setError(error));
  };

  // useEffect(() => {
  //   if (hasMounted) {
  //     innerFetch(querySearch, page);
  //   } else {
  //     setHasMounted(true);
  //   }
  // }, [querySearch, page, hasMounted]);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    // if (querySearch === '') {
    //   return;
    // }

    innerFetch(querySearch, page);
  }, [ page, querySearch]);

  const handleSearchSubmit = querySearch => {
    setQuerySearch(querySearch);
    setPage(1);
    setPicturesArray([]);
  };
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  const toggleModal = () => {
    setShowModal(false);
  };
  const openBigImage = currentUrl => {
    setActiveImg(picturesArray.find(img => img.largeImageURL === currentUrl));
    setShowModal(true);
  };

  return (
    <MainContainer>
      <SearchBarHook onSubmit={handleSearchSubmit} />
      {/* {status === STATUS.REJECTED &&
       } */}
      {status === STATUS.PENDING && <Loader />}

      <ImageGallery picturesArray={picturesArray} openBigImage={openBigImage} />
      {status !== STATUS.PENDING && showMoreBTn && (
        <LoadMoreBtn type="button" onClick={handleLoadMore}>
          Load More
        </LoadMoreBtn>
      )}
      {showModal && (
        <ModalHook onClose={toggleModal}>
          <img width="60%" src={activeImg.largeImageURL} alt={activeImg.tags} />
        </ModalHook>
      )}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
      />
    </MainContainer>
  );
}
