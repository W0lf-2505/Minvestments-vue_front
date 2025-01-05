<template>
    <div class="row">
      <!-- Popup Trigger -->
      <a href="#" @click="openPopup"></a>
  
      <!-- Popup Container -->
      <div class="popup-container col-lg-7" v-if="isPopupOpen">
        <div class="popup-content">
          <button @click="closePopup" type="button"><i class="top-0 rotate-180 ni ni-button-play" aria-hidden="true"></i></button>
          <!-- <iframe :src="popupUrl" frameborder="0" width="800" height="600"></iframe> -->
          <!-- <iframe v-html="sanitizedHtml" frameborder="0" width="800" height="600"></iframe> -->
          <iframe :srcdoc="sanitizedHtml" :class=" this.$store.state.isLargeScreen ? 'iframeclass-large':'iframeclass-small'" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DOMPurify from 'dompurify';
  import { mapGetters } from "vuex";
  import axios from 'axios';

  export default {
    data() {
      return {
        isPopupOpen: false,
        popupUrl: '', // URL to load in the iframe
        
        allData: "",
        feed: "",
        filteredHtml: ''
      };
    },
    computed: {
      ...mapGetters([
         'isLargeScreen'
      ]),
    sanitizedHtml() {
      console.log(DOMPurify.sanitize(this.feed))
      return DOMPurify.sanitize(this.feed);
    },
  },
    
    methods: {
      async openPopup(url) {
        this.isPopupOpen = true;
        this.popupUrl = url; // Replace with the actual URL
        await this.fetchAndFilterHtml(this.popupUrl)
        this.feed = this.filteredHtml.replace('<a','<div').replace('</a>','</div>')
      },

      async fetchAndFilterHtml(url) {
      try {
        const response = await axios.get(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const body = doc.querySelector('body');
        const section = body.querySelector('section');
        const div = section.querySelector('div');

        // Parse the HTML content
        const html = new DOMParser().parseFromString(div.innerHTML, 'text/html');

        // Find all the matching tags you want to remove
        const selectorsToRemove = [
          '.tabslinks', 'button', 'img', '.social_icons_mobile_wrapper',
          '.social_icons_wrapper', '.pagenation', '.author_wrapper',
          '.tags_wrapper', '.page_right_wrapper', '.maintextdiv', '.jump_to'
        ];

        selectorsToRemove.forEach(selector => {
          const elements = html.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });

        // Set the filtered HTML content
        this.filteredHtml = html.body.innerHTML;
      } catch (error) {
        console.error('Error fetching or processing HTML:', error);
      }
    },
      closePopup() {
        this.isPopupOpen = false;
        this.popupUrl = ''; // Clear the URL
        this.feed = '';
        this.allData = '';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Style the popup container */
  .popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  /* Style the popup content */
  .popup-content {
    background-color: #fff;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    text-align: center;
    height: 80%;
  }

  .iframeclass-large{
    height: 100%;
    width: 600px;
  }
  .iframeclass-small{
    height: 100%;
    width: 300px;
  }
  </style>
  