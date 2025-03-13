const showLoader = () => {
  document.getElementById('loader').classList.remove('hidden')
  document.getElementById('video-container').classList.add('hidden')
}
const hideLoader = () => {
  document.getElementById('loader').classList.add('hidden')
  document.getElementById('video-container').classList.remove('hidden')
}


function removeClass() {
  const activeButtons = document.getElementsByClassName("active");
  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }
};

function loadCategories() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
}

function loadVideos(searchText = "") {
  showLoader()
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => {
    
      removeClass()
      document.getElementById('btn-all').classList.add('active')
      displayVideos(data.videos);
    });
}

const loadCategoriesVideos = (id) => {
  showLoader();
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeClass();
      const clickButton = document.getElementById(`btn-${id}`);
      clickButton.classList.add("active");
      displayVideos(data.category);
    });
};
const loadVideoDetails = (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
  fetch(url)
    .then(res => res.json())
  .then(data=>displayVideoDetails(data.video))
}

const displayVideoDetails = (video) => {
 
  document.getElementById('video_details').showModal()
  const detailsContainer = document.getElementById('details-container');
  detailsContainer.innerHTML = `
  
  <div class="card bg-base-100 image-full  shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
   
  </div>
</div>
  `
}
function displayCategories(categories) {
  
  const categoryContainer = document.getElementById("category-container");
  for (const cat of categories) {
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `<button id="btn-${cat.category_id}" onclick="loadCategoriesVideos(${cat.category_id})" class="btn btn-sm  hover:bg-[#FF1F3D] hover:text-white ">${cat.category}</button>`;

    categoryContainer.appendChild(categoryDiv);
  }
}

const displayVideos = (videos) => {
  
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.innerHTML = `<div class="col-span-full text-center py-20">
        <img class="mx-auto" src="Icon.png" alt="">
        <h2 class="text-2xl font-bold">Oops!! Sorry, There is no content here</h2>
      </div>`;
    hideLoader()
    return;
  }
  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `
         <div class="card bg-base-100  ">
            <figure class="relative">
              <img class="w-full h-[150px] object-cover"
                src="${video.thumbnail}" />
                <span class="absolute bottom-2 right-2 text-white bg-black px-2 text-sm rounded">3hrs 56 min ago</span>
            </figure>
            <div class=" flex gap-3 px-0 py-5">
             <div class="profile">
                <div class="avatar">
                    <div class="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
                      <img src="${video.authors[0].profile_picture}" />
                    </div>
                  </div>
             </div>
             <div class="intfo">
                <h2 class="text-sm font-semibold">Midnight Serenade</h2>
                <p class="text-sm text-gray-400 flex gap-1">${video.authors[0].profile_name}
                 ${video.authors[0].verified==true ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png" alt=""></p>`:``}
               
                <p class="text-sm text-gray-400">${video.others.views}</p>
             </div>
              
            </div>
            <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block">Show Details</button>
          </div>
        `;
    videoContainer.appendChild(videoCard);
  });
  hideLoader()
};


document.getElementById('search-input').addEventListener('keyup', (e) => {
  const input = e.target.value;
  loadVideos(input)
})

loadCategories();
