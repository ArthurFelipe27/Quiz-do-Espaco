const fallbackInfo = {
    "Júpiter (planeta)": {
        texto: "Júpiter é o maior planeta do Sistema Solar, composto principalmente de hidrogênio e hélio, conhecido por sua Grande Mancha Vermelha.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg"
    },
    "Marte (planeta)": {
        texto: "Marte é o quarto planeta do Sistema Solar, conhecido como o Planeta Vermelho devido à sua superfície rica em óxido de ferro.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg"
    },
    "Sol": {
        texto: "O Sol é a estrela central do Sistema Solar e a principal fonte de luz e energia da Terra.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Solar_sys8.jpg"
    },
    "Yuri Gagarin": {
        texto: "Yuri Gagarin foi o primeiro ser humano a viajar ao espaço, em 1961, a bordo da espaçonave Vostok 1.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Yuri_Gagarin_1961.jpg"
    },
    "Anéis de Saturno": {
        texto: "Os anéis de Saturno são compostos por bilhões de partículas de gelo e rocha, sendo os mais visíveis do Sistema Solar.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_from_Cassini_Orbiter_%282004-10-06%29.jpg"
    },
    "Lua": {
        texto: "A Lua é o único satélite natural da Terra e o corpo celeste mais próximo do nosso planeta.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg"
    },
    "Via Láctea": {
        texto: "A Via Láctea é a galáxia espiral onde o Sistema Solar está localizado.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Milky_Way_Galaxy.jpg"
    },
    "Grande Mancha Vermelha": {
        texto: "A Grande Mancha Vermelha é uma gigantesca tempestade anticiclônica na atmosfera de Júpiter, maior que a Terra.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Great_Red_Spot_From_Voyager_1.jpg"
    },
    "Vênus (planeta)": {
        texto: "Vênus é o segundo planeta a partir do Sol e o mais quente do Sistema Solar, devido ao seu efeito estufa intenso.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_globe.jpg"
    },
    "Valentina Tereshkova": {
        texto: "Valentina Tereshkova foi a primeira mulher a viajar ao espaço, em 1963, a bordo da Vostok 6.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/6/61/Tereshkova.jpg"
    },
    "Netuno (planeta)": {
        texto: "Netuno é o oitavo planeta do Sistema Solar, conhecido por seus ventos supersônicos e coloração azul intensa.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
    },
    "Voyager 1": {
        texto: "Voyager 1 é uma sonda espacial lançada em 1977 que se tornou o primeiro objeto feito pelo homem a entrar no espaço interestelar.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/d/df/Voyager.jpg"
    },
    "Ceres (asteroide)": {
        texto: "Ceres é o maior objeto do cinturão de asteroides entre Marte e Júpiter e é classificado como planeta anão.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Ceres_-_RC3_-_Haulani_Crater_(22381131691).jpg"
    },
    "Urano (planeta)": {
        texto: "Urano é o sétimo planeta do Sistema Solar, com rotação inclinada e aparência azulada devido ao metano na atmosfera.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg"
    },
    "Buraco negro": {
        texto: "Buracos negros são regiões do espaço com gravidade tão intensa que nem a luz pode escapar.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Black_hole_-_Messier_87_crop_max_res.jpg"
    },
    "Distância Terra para o Sol": {
        texto: "A distância média da Terra ao Sol é de aproximadamente 150 milhões de quilômetros.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Solar_System_size_to_scale_pt.svg"
    },
    "Apollo 11": {
        texto: "A Apollo 11 foi a missão da NASA que levou o primeiro homem à Lua, Neil Armstrong, em 1969.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/9/99/Apollo_11_Lunar_Module_on_the_Moon.jpg"
    },
    "Venus (planeta)": {
        texto: "Vênus tem um dia mais longo que seu ano: leva mais tempo para girar em torno de si do que para orbitar o Sol.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_globe.jpg"
    },
    "Titã (lua)": {
        texto: "Titã é a maior lua de Saturno, e possui uma atmosfera densa composta principalmente de nitrogênio.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/0/07/Titan_in_true_color.jpg"
    },
    "Sputnik 1": {
        texto: "Sputnik 1 foi o primeiro satélite artificial lançado pela União Soviética em 1957, marcando o início da era espacial.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sputnik_1_Replica_-_Monino.jpg"
    },
    "Hidrogenio (elemento)": {
        texto: "O hidrogênio é o elemento mais abundante no Sol e no universo, sendo o combustível das estrelas.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Hydrogen_discharge_tube.jpg"
    },
    "Saturno (planeta)": {
        texto: "Saturno é um gigante gasoso conhecido por seu sistema de anéis e por possuir mais de 80 luas conhecidas.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_from_Cassini_Orbiter_%282004-10-06%29.jpg"
    },
    "Supernova": {
        texto: "Uma supernova é uma explosão estelar extremamente energética que ocorre no fim da vida de uma estrela massiva.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/3/3c/SN1994D.jpg"
    },
    "Plutão": {
        texto: "Plutão é um planeta anão localizado no Cinturão de Kuiper, anteriormente considerado o nono planeta do Sistema Solar.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Nh-pluto-in-true-color_2x_JPEG-edit-frame.jpg"
    },
    "Telescópio espacial Hubble": {
        texto: "O Hubble é um telescópio espacial lançado em 1990, que permite observações sem a interferência da atmosfera terrestre.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg"
    },
    "planetas anões": {
        texto: "Planetas anões são corpos celestes que orbitam o Sol, mas não têm massa suficiente para limpar sua órbita, como Plutão, Ceres e Eris.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Dwarf_planets_size_comparison.jpg"
    }
};
