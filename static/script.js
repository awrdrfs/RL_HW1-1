document.addEventListener('DOMContentLoaded', () => {
    // 獲取 DOM 元素
    const generateBtn = document.getElementById('generate-btn');
    const gridSizeInput = document.getElementById('grid-size');
    const gridContainer = document.getElementById('grid-container');
    const statusMessage = document.getElementById('status-message');
    const obstacleCountSpan = document.getElementById('obstacle-count');
    const stateDot = document.getElementById('state-dot');
    const statusCard = document.querySelector('.status-card');

    // 狀態變數
    let currentN = 5;
    let maxObstacles = 0;
    let obstaclesPlaced = 0;
    // 狀態機：WAITING -> PLACE_START -> PLACE_END -> PLACE_OBSTACLES -> DONE
    let currentState = 'WAITING'; 

    // 初始化網格
    function initGrid() {
        const inputVal = gridSizeInput.value;
        let n = parseInt(inputVal, 10);
        
        // 驗證輸入範圍：5 到 9
        if (isNaN(n) || n < 5 || n > 9) {
            alert('請輸入 5 到 9 之間的有效整數！');
            // 將數值修正到合法範圍內
            n = Math.max(5, Math.min(9, isNaN(n) ? 5 : n));
            gridSizeInput.value = n;
            return;
        }

        currentN = n;
        maxObstacles = n - 2;
        obstaclesPlaced = 0;
        currentState = 'PLACE_START';
        
        // 清空現有網格
        gridContainer.innerHTML = '';
        
        // 設定 CSS Grid 的列數
        gridContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

        // 動態生成 n x n 個單元格
        for (let i = 0; i < n * n; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i;
            
            // 綁定點擊事件
            cell.addEventListener('click', () => handleCellClick(cell));
            
            // 設定編號
            cell.textContent = i + 1;
            
            // 增加進場動畫延遲，產生波浪效果
            cell.style.animationDelay = `${(Math.floor(i / n) + (i % n)) * 0.02}s`;
            cell.style.animation = 'fadeIn 0.3s ease-out both';
            
            gridContainer.appendChild(cell);
        }

        updateUI();
    }

    // 處理單元格點擊事件
    function handleCellClick(cell) {
        // 如果單元格已經被標記，則不可重複點擊
        if (cell.classList.contains('start') || 
            cell.classList.contains('end') || 
            cell.classList.contains('obstacle')) {
            return;
        }

        switch (currentState) {
            case 'PLACE_START':
                cell.classList.add('start');
                currentState = 'PLACE_END';
                updateUI();
                break;
                
            case 'PLACE_END':
                cell.classList.add('end');
                currentState = 'PLACE_OBSTACLES';
                updateUI();
                break;
                
            case 'PLACE_OBSTACLES':
                if (obstaclesPlaced < maxObstacles) {
                    cell.classList.add('obstacle');
                    obstaclesPlaced++;
                    updateUI();
                    
                    // 當障礙物達到上限，進入完成狀態
                    if (obstaclesPlaced >= maxObstacles) {
                        currentState = 'DONE';
                        updateUI();
                    }
                }
                break;
        }
    }

    // 更新使用者介面文字與狀態指示燈
    function updateUI() {
        // 更新剩餘數量
        obstacleCountSpan.textContent = Math.max(0, maxObstacles - obstaclesPlaced);
        
        // 移除所有狀態 class
        stateDot.className = 'dot';
        statusCard.style.backgroundColor = '';
        statusCard.style.borderColor = '';

        switch(currentState) {
            case 'PLACE_START':
                statusMessage.textContent = '步驟 1：請點擊地圖設定「起點」（將顯示為綠色）';
                stateDot.classList.add('start');
                statusCard.style.backgroundColor = '#ecfdf5'; // 淺綠色背景
                statusCard.style.borderColor = '#a7f3d0';
                break;
            case 'PLACE_END':
                statusMessage.textContent = '步驟 2：請點擊地圖設定「終點」（將顯示為紅色）';
                stateDot.classList.add('end');
                statusCard.style.backgroundColor = '#fef2f2'; // 淺紅色背景
                statusCard.style.borderColor = '#fecaca';
                break;
            case 'PLACE_OBSTACLES':
                statusMessage.textContent = `步驟 3：請點擊設定「障礙物」，最多還可設定 ${maxObstacles - obstaclesPlaced} 個`;
                stateDot.classList.add('obstacle');
                statusCard.style.backgroundColor = '#f3f4f6'; // 淺灰色背景
                statusCard.style.borderColor = '#e5e7eb';
                break;
            case 'DONE':
                statusMessage.textContent = '設定完成！您可以重新點擊「重置網格」以重置。';
                stateDot.classList.add('done');
                statusCard.style.backgroundColor = '#eff6ff'; // 恢復預設藍色
                statusCard.style.borderColor = '#bfdbfe';
                break;
            default:
                statusMessage.textContent = '請點擊「重置網格」以開始設定。';
                stateDot.classList.add('waiting');
        }
    }

    // 綁定重置按鈕事件
    generateBtn.addEventListener('click', initGrid);
    
    // 頁面載入時預設初始化一個網格
    initGrid();
});
