function ajaxTab() {
    const tabControl = this;

    if ( tabControl.classList.contains('active') ) {
        return;
    }

    const activeTabControl = document.querySelector('.tab-control.active');
    const activeTab = document.querySelector('.tab.active');

    if ( activeTabControl !== null && activeTab !== null ) {
        activeTabControl.classList.remove('active');
        activeTab.classList.remove('active');

    }

    const tabTarget = tabControl.getAttribute('data-tab-target');
    const tab = document.querySelector(`.tab[data-tab=${tabTarget}]`);


    tabControl.classList.add('active');
    tab.classList.add('active');

    if ( !tab.hasChildNodes() ) {
        const url = tabControl.getAttribute('data-tab-url');
        fetch(url)
            .then(function(response) {
                if ( response.status >= 200 && response.status < 300 ) {
                    return response.json();
                }   else {
                    const error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then(function(data) {
                const title = data.title;
                let text = data.content;

                let newText = text.replace(/\.|,/g,'').split(' ').sort();
                let mostPopularNum = null,
                    mostPopularItem = '';

                for ( let i =0; i < newText.length; i++ ) {
                    let single = newText[i];
                    let total = (newText.lastIndexOf(single)-newText.indexOf(single))+1;

                    if ( total > mostPopularNum ) {
                        mostPopularItem = newText[i];
                        mostPopularNum = total;
                        i = newText.lastIndexOf(single)+1;
                    }
                }

                let finalText = text.split(mostPopularItem)
                    .join(`<span>${mostPopularItem}</span>`);

                const tabContent = document.createElement('div');
                const tabTitle = document.createElement('div');
                tabTitle.classList.add('tab__title');
                tabTitle.append(title);
                const tabText = document.createElement('p');
                tabText.innerHTML = finalText.trim();

                tabContent.appendChild(tabTitle);
                tabContent.appendChild(tabText);
                tab.appendChild(tabContent);
            });
    }
}

const tabControls = document.querySelectorAll('.tab-control');
tabControls.forEach((item) => {
   item.addEventListener('click', ajaxTab);
});
