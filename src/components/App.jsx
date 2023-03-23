import React, { Component } from 'react';

import Modal from './Utils/Modal/Modal';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import { FetchAPI } from './Utils/Fetch/API';
import Loader from './Loader/Loader';
import { LoadMoreBtn, MainContainer } from './App.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};

export class App extends Component {
  state = {
    showModal: false,
    querySearch: '',
    page: 1,
    picturesArray: [],
    showMoreBTn: false,
    activeImg: {},
    status: STATUS.IDLE,
    loading: false,
    error: '',
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.state.querySearch !== prevState.querySearch ||
      this.state.page !== prevState.page
    ) {
      this.setState({ status: STATUS.PENDING });
      FetchAPI(this.state.querySearch, this.state.page).then(results => {
        this.setState(prevState => ({
          picturesArray: [...prevState.picturesArray, ...results.hits],
          status: STATUS.IDLE,
        }));
        if (results.hits.length === 0) {
          this.setState({ status: STATUS.IDLE, showMoreBTn: false });
          toast.error(`We didnt find results for ${this.state.querySearch}`, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
        if (results.totalHits > 12) {
          this.setState({ showMoreBTn: true });
        } else {
          this.setState({ showMoreBTn: false });
        }
      });
      // .catch(error => {
      //   console.log(error);
      //   return this.setState({
      //     error: error.message,
      //     status: STATUS.REJECTED,
      //   });
      // });
    }
  }

  handleSearchSubmit = querySearch => {
    if (this.state.querySearch === querySearch) {
      return;
    }
    this.setState({ querySearch, page: 1, picturesArray: [] });
  };
  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };
  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  };
  openBigImage = currentUrl => {
    this.setState({
      activeImg: this.state.picturesArray.find(
        img => img.largeImageURL === currentUrl
      ),
      showModal: true,
    });
  };

  render() {
    const { showModal, activeImg, status, showMoreBTn, picturesArray } =
      this.state;
    return (
      <MainContainer>
        <Searchbar onSubmit={this.handleSearchSubmit} />

        {status === STATUS.PENDING && <Loader />}

        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img
              width="60%"
              src={activeImg.largeImageURL}
              alt={activeImg.tags}
            />
          </Modal>
        )}
        <ImageGallery
          picturesArray={picturesArray}
          openBigImage={this.openBigImage}
          // toggleModal={this.toggleModal}
        />

        {/* {status === STATUS.REJECTED && <p>{error}</p>} */}
        {showMoreBTn && (
          <LoadMoreBtn type="button" onClick={this.handleLoadMore}>
            Load More
          </LoadMoreBtn>
        )}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </MainContainer>
    );
  }
}

export default App;
