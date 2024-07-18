        const fallSpeed = 300; // Скорость падения в пикселях
        function changeLanguage(){
            document.getElementById("lang").value="RU";
        }
        function createStar(x, y) {
            const star = document.createElement('div');

            star.classList.add('star');
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;

            // Задаем размер звездочкам
            const s = Math.floor(Math.random() * 3 + 3);
            star.style.width = `${s}px`;
            star.style.height = `${s}px`;

            star.style.opacity = 0.2;
            star.style.transition = 'opacity 3s';

            // Вычисляем длительность анимации на основе высоты экрана и скорости падения
            const duration = (window.innerHeight-y) / fallSpeed;
            star.style.animationDuration = `${duration}s`;

            document.body.appendChild(star);

             requestAnimationFrame(() => {
             star.style.opacity = 1;
                });


            // Удаляем звездочку после окончания анимации
            setTimeout(() => {
                star.remove();
            }, duration * 1000);
        }

        function fillScreenWithStars() {
            const cols = 10;
            const rows = 10;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    createStar(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
                }
            }
        }

        function addFallingStars() {
            createStar(Math.random() * window.innerWidth, 0);
        }

        function deleteStars()
        {
              if (document.hidden) 
              {
                const stars = document.querySelectorAll('.star');
                stars.forEach(star => star.remove());
              } 
              else
              {
                fillScreenWithStars();
              }
        }