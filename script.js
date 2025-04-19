class TowerOfHanoi {
    constructor() {
        this.diskCount = 3;
        this.towers = [[], [], []];
        this.moveCount = 0;
        this.isDragging = false;
        this.selectedDisk = null;
        this.solution = [];
        this.isSolutionVisible = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 基本游戏控件事件监听
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('resetGame').addEventListener('click', () => this.resetGame());
        document.getElementById('showSteps').addEventListener('click', () => this.showMinimumSteps());
        document.getElementById('showSolution').addEventListener('click', () => this.showSolution());

        // Victory modal初始化
        this.victoryModal = document.getElementById('victoryModal');
        const playAgainButton = document.getElementById('playAgain');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', () => {
                if (this.victoryModal) {
                    this.victoryModal.classList.add('hidden');
                }
                this.resetGame();
                this.startGame();
            });
        }

        // Setup drag and drop for towers
        document.querySelectorAll('.tower').forEach(tower => {
            tower.addEventListener('dragover', e => this.handleDragOver(e));
            tower.addEventListener('drop', e => this.handleDrop(e));
        });
    }

    startGame() {
        this.diskCount = parseInt(document.getElementById('diskCount').value);
        this.resetGame();
        this.createDisks();
    }

    resetGame() {
        this.towers = [[], [], []];
        this.moveCount = 0;
        document.getElementById('moveCount').textContent = 'Moves: 0';
        document.getElementById('minSteps').textContent = '';
        document.getElementById('solution').classList.add('hidden');
        document.getElementById('showSolution').textContent = 'Show Solution';
        this.isSolutionVisible = false;
        
        if (this.victoryModal) {
            this.victoryModal.classList.add('hidden');
        }
        
        // Clear existing disks
        document.querySelectorAll('.disk').forEach(disk => disk.remove());
    }

    createDisks() {
        const tower1 = document.getElementById('tower1');
        this.towers[0] = []; // Clear the array first
        
        // Create disks from largest to smallest
        for (let i = this.diskCount; i >= 1; i--) {
            const disk = document.createElement('div');
            disk.className = 'disk';
            disk.draggable = true;
            disk.style.width = `${100 + (i * 20)}px`;
            disk.setAttribute('data-size', i);
            disk.textContent = i;
            
            // Add drag event listeners
            disk.addEventListener('dragstart', (e) => this.handleDragStart(e));
            disk.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // Add to the beginning of tower1
            tower1.insertBefore(disk, tower1.firstChild);
            // Add to the beginning of the array (smallest on top)
            this.towers[0].unshift(i);
        }
        
        console.log('Initial tower state:', this.towers[0]);
    }

    handleDragStart(e) {
        const tower = e.target.parentElement;
        const towerIndex = parseInt(tower.id.slice(-1)) - 1;
        
        // Only allow dragging the top disk
        if (e.target !== tower.children[0]) {
            e.preventDefault();
            return;
        }

        e.target.classList.add('dragging');
        this.selectedDisk = {
            element: e.target,
            fromTower: towerIndex
        };
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        if (!this.selectedDisk) return;

        const targetTower = e.currentTarget;
        const toTowerIndex = parseInt(targetTower.id.slice(-1)) - 1;
        const diskSize = parseInt(this.selectedDisk.element.getAttribute('data-size'));
        const fromTowerIndex = this.selectedDisk.fromTower;

        // Don't do anything if dropping on the same tower
        if (fromTowerIndex === toTowerIndex) {
            this.selectedDisk = null;
            return;
        }

        console.log('Moving disk:', diskSize);
        console.log('From tower:', fromTowerIndex);
        console.log('To tower:', toTowerIndex);
        console.log('Current towers state:', JSON.parse(JSON.stringify(this.towers)));

        // Check if move is valid
        if (this.isValidMove(diskSize, toTowerIndex)) {
            // Update towers array
            this.towers[this.selectedDisk.fromTower].shift();
            this.towers[toTowerIndex].unshift(diskSize);

            // Move disk element
            targetTower.insertBefore(this.selectedDisk.element, targetTower.firstChild);

            // Update move count
            this.moveCount++;
            document.getElementById('moveCount').textContent = `Moves: ${this.moveCount}`;

            // Check for win
            if (this.checkWin()) {
                this.showVictoryModal();
            }
        }

        this.selectedDisk = null;
    }

    isValidMove(diskSize, toTower) {
        const targetTower = this.towers[toTower];
        console.log('Target tower state:', targetTower);
        console.log('Disk size to move:', diskSize);
        console.log('Target tower top disk:', targetTower[0]);
        
        // The move is valid if:
        // 1. The target tower is empty, OR
        // 2. The top disk of target tower is larger than the disk being moved
        const isValid = targetTower.length === 0 || targetTower[0] > diskSize;
        
        // Log the validation result
        console.log('Is empty tower:', targetTower.length === 0);
        console.log('Top disk is larger:', targetTower[0] > diskSize);
        console.log('Is valid move:', isValid);
        
        return isValid;
    }

    checkWin() {
        console.log('Checking win condition...');
        console.log('Tower 3 state:', this.towers[2]);
        console.log('Total disks:', this.diskCount);

        // 检查第三根柱子上的圆盘数量是否正确
        const hasCorrectCount = this.towers[2].length === this.diskCount;
        console.log('Has correct disk count:', hasCorrectCount);

        // 检查圆盘是否按从小到大排列（从上到下1,2,3...）
        const isCorrectOrder = this.towers[2].every((disk, index) => {
            const isValid = disk === index + 1;
            console.log(`Disk at position ${index}: ${disk}, should be ${index + 1}, valid: ${isValid}`);
            return isValid;
        });
        console.log('Is in correct order:', isCorrectOrder);

        const isWin = hasCorrectCount && isCorrectOrder;
        console.log('Win condition met:', isWin);

        return isWin;
    }

    showMinimumSteps() {
        const minSteps = Math.pow(2, this.diskCount) - 1;
        document.getElementById('minSteps').textContent = 
            `Minimum steps required: ${minSteps}`;
        return minSteps;
    }

    showVictoryModal() {
        if (!this.victoryModal) {
            this.victoryModal = document.getElementById('victoryModal');
        }

        if (this.victoryModal) {
            console.log('Showing victory modal...');
            const minSteps = this.showMinimumSteps();
            document.getElementById('finalMoves').textContent = this.moveCount;
            document.getElementById('minimalMoves').textContent = minSteps;
            this.victoryModal.classList.remove('hidden');
        } else {
            console.error('Victory modal element not found!');
        }
    }

    calculateSolution(n, source, auxiliary, target, steps = []) {
        if (n > 0) {
            this.calculateSolution(n - 1, source, target, auxiliary, steps);
            steps.push(`Move disk ${n} from Tower ${source + 1} to Tower ${target + 1}`);
            this.calculateSolution(n - 1, auxiliary, source, target, steps);
        }
        return steps;
    }

    showSolution() {
        const solutionDiv = document.getElementById('solution');
        if (!this.isSolutionVisible) {
            this.solution = this.calculateSolution(this.diskCount, 0, 1, 2);
            solutionDiv.innerHTML = this.solution.map((step, index) => 
                `${index + 1}. ${step}`
            ).join('<br>');
            solutionDiv.classList.remove('hidden');
            document.getElementById('showSolution').textContent = 'Hide Solution';
        } else {
            solutionDiv.classList.add('hidden');
            document.getElementById('showSolution').textContent = 'Show Solution';
        }
        this.isSolutionVisible = !this.isSolutionVisible;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TowerOfHanoi();
});
