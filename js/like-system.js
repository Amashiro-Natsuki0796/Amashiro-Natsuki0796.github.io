// 点赞系统（使用本地存储）
document.addEventListener('DOMContentLoaded', function() {
  let likeCount = 0;
  
  // 从本地存储获取点赞数
  function fetchLikeCount() {
    const storedCount = localStorage.getItem('blog-like-count') || 0;
    likeCount = parseInt(storedCount) || 0;
    updateDisplay();
  }
  
  // 更新博主卡片中的点赞显示
  function updateDisplay() {
    const likeCountDisplay = document.getElementById('like-count-display');
    if (likeCountDisplay) {
      likeCountDisplay.textContent = likeCount;
    }
  }
  
  // 修改博主信息卡片中的标签为点赞量
  function updateAuthorCard() {
    // 等待博主信息卡片加载完成
    const siteDataElements = document.querySelectorAll('.site-data');
    siteDataElements.forEach(siteData => {
      // 获取所有的统计项
      const items = siteData.querySelectorAll('a');
      
      if (items.length >= 3) {
        // 获取第二个项目（标签项目）
        const tagsItem = items[1];
        if (tagsItem) {
          // 修改链接和文字
          tagsItem.href = 'javascript:void(0);'; // 阻止跳转
          const headline = tagsItem.querySelector('.headline');
          if (headline) {
              headline.textContent = '点赞'; // 改为点赞
            }
          
          // 更新点赞数量显示
          const lengthNum = tagsItem.querySelector('.length-num');
          if (lengthNum) {
            lengthNum.id = 'like-count-display'; // 添加ID方便更新
            lengthNum.textContent = likeCount;
          }
        }
      }
    });
  }
  
  // 增加点赞数
  function incrementLikeCount() {
    let localLikeCount = parseInt(localStorage.getItem('blog-like-count')) || 0;
    localLikeCount += 1;
    localStorage.setItem('blog-like-count', localLikeCount.toString());
    likeCount = localLikeCount;
    
    // 强制更新显示
    updateDisplay();
    updateAuthorCard(); // 重新更新作者卡片
    
    console.log('点赞数已更新:', likeCount);
  }
  
  // 为社交链接中的点赞图标添加点击功能
  function addLikeFunctionality() {
    // 等待社交图标加载完成
    const socialIcons = document.querySelector('.card-info-social-icons');
    if (socialIcons) {
      // 查找点赞图标（heart图标）
      const heartIcon = socialIcons.querySelector('i[class*="fa-heart"]');
      if (heartIcon) {
        // 确保只添加一次事件监听器
        if (!heartIcon.dataset.likeEventAdded) {
          heartIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认行为
            
            // 添加点击动画效果
            heartIcon.parentElement.classList.add('like-clicked');
            setTimeout(() => {
              heartIcon.parentElement.classList.remove('like-clicked');
            }, 600);
            
            // 添加点赞状态效果
            heartIcon.classList.add('liked');
            setTimeout(() => {
              heartIcon.classList.remove('liked');
            }, 500);
            
            // 增加点赞数
            incrementLikeCount();
            
            // 显示一个提示信息，说明点赞成功
            const originalText = heartIcon.parentElement.title || '点赞';
            heartIcon.parentElement.title = '感谢您的点赞！';
            setTimeout(() => {
              heartIcon.parentElement.title = originalText;
            }, 2000);
            

          });
          
          // 标记事件已添加
          heartIcon.dataset.likeEventAdded = 'true';
        }
      }
    }
  }
  
  // 初始化点赞数
  fetchLikeCount();
  
  // 等待页面元素加载完成
  const checkAndModify = setInterval(() => {
    const siteData = document.querySelector('.site-data');
    const socialIcons = document.querySelector('.card-info-social-icons');
    
    if (siteData) {
      clearInterval(checkAndModify);
      updateAuthorCard();
    }
    
    if (socialIcons) {
      addLikeFunctionality();
    }
  }, 100);
  
  // 每次PJAX完成后也要执行（如果使用了PJAX）
  document.addEventListener('pjax:complete', function() {
    setTimeout(() => {
      fetchLikeCount(); // 重新获取点赞数
      updateAuthorCard();
      addLikeFunctionality();
    }, 100);
  });
});