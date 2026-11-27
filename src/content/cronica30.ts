// Crónica «Armonía: 30 años trabajando por la conservación de la avifauna amenazada de Bolivia».
// Copiada del sitio anterior (dev.armoniabolivia.org, 4 de agosto de 2026); las fotos están en public/images/cronica-30.
// Contenido solo en español, como el original.

export type BloqueCronica =
  | { t: "parrafo"; html: string }
  | { t: "subtitulo"; texto: string }
  | { t: "cita"; texto: string }
  | { t: "imagen"; src: string; pie: string }
  | { t: "galeria"; fotos: { src: string; pie: string }[] };

export const CRONICA_30 = {
  titulo: "Armonía: 30 años trabajando por la conservación de la avifauna amenazada de Bolivia",
  fecha: "2026-08-04",
  autor: "Armonía",
  bloques: [
  {
    "t": "imagen",
    "src": "/images/cronica-30/1996-05-apolo-lois-bennet-et-le-maule.webp",
    "pie": "Foto: Louis Jammes junto a la avioneta que puso a disposición de Armonía para apoyar el traslado de científicos durante las expediciones de campo."
  },
  {
    "t": "subtitulo",
    "texto": "Antes de alzar vuelo, Armonía fue una idea."
  },
  {
    "t": "parrafo",
    "html": "Una idea concebida la noche del 10 de agosto de 1992 en una antigua pista de aterrizaje asentada sobre la meseta de Caparuch, al sur del Parque Nacional Noel Kempff Mercado. Allí, en esa planicie de exuberantes islas boscosas y suelos impregnados del aroma a tierra húmeda, estaba Louis Jammes. Tenía 44 años y una prolífica trayectoria como piloto de avioneta. Durante décadas había transportado a científicos de renombre internacional, entre ellos varios investigadores del Museo Field de Historia Natural de Chicago, hacia algunos de los lugares más recónditos de la amazonia boliviana."
  },
  {
    "t": "parrafo",
    "html": "Una de esas personalidades era <a href=\"https://www.allaboutbirds.org/news/the-legacy-of-ted-parker/\">Ted Parker</a>, el ornitólogo estadounidense considerado el mayor especialista del mundo en cantos de pájaros. Aquel día, Jammes lo había trasladado hasta esa zona para guiar a un grupo de aficionados a la observación de aves."
  },
  {
    "t": "parrafo",
    "html": "Al culminar la actividad, decidieron acampar. Mientras aguardaban la llegada del alba, conversaron durante horas sobre un rasgo compartido: el amor por los seres de pico y plumas. En algún momento de aquella larga noche, una inquietud se asomó y Jammes pensó en voz alta:"
  },
  {
    "t": "parrafo",
    "html": "—En Bolivia no hay alguien conservando aves, ¿por qué no hacer algo?"
  },
  {
    "t": "parrafo",
    "html": "Ese “algo” pronto adquirió una forma concreta: crear una organización dedicada al cuidado de las aves en Bolivia. A Parker, un hombre devoto de esas criaturas silvestres de Sudamérica y preocupado por la destrucción de los ecosistemas, la propuesta lo entusiasmó de inmediato. El nuevo día apareció y ambos se despidieron con la promesa de mantenerse en contacto. Parker quería seguir de cerca el destino de aquel proyecto germinado bajo la luz de la luna."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/1992-08-huanchaca-1-ted-parker-et-birdwatchers-copie.webp",
    "pie": "Foto: Cortesía de Louis Jammes. Ted Parker (lado derecho) junto a un grupo de observadores de aves en la meseta de Caparuch."
  },
  {
    "t": "parrafo",
    "html": "Un mes después, en septiembre de 1992, la idea comenzó a despegar. Jammes contactó a estudiantes de Biología de la Universidad Autónoma Gabriel René Moreno y los animó a sumarse. Una de las primeras en aceptar el desafío fue Érika Cuéllar. Pronto se incorporaron más personas y, de ese esfuerzo colectivo, nació Armonía, la primera organización boliviana dedicada a la conservación de las aves, en Santa Cruz de la Sierra."
  },
  {
    "t": "parrafo",
    "html": "En cuanto Parker supo de esa noticia no sólo celebró el surgimiento de un proyecto que ayudaría a llenar un vacío largamente ignorado en el país, sino también le comunicó a Jammes que, una vez concluida una expedición prevista para agosto de 1993 en Ecuador, viajaría directamente a Santa Cruz para reunirse con el equipo y llevar consigo materiales que ayudarían a fortalecer la organización."
  },
  {
    "t": "parrafo",
    "html": "Sin embargo, la fatalidad truncó aquel plan y Parker jamás regresó a Bolivia. El 3 de agosto de 1993, la avioneta en la que realizaba investigaciones sobre biodiversidad en un remoto bosque nuboso de Ecuador se estrelló contra una ladera montañosa. Murió a los 41 años junto con varios colegas."
  },
  {
    "t": "galeria",
    "fotos": [
      {
        "src": "/images/cronica-30/1992-flor-de-oro-ted-parker.webp",
        "pie": "Fotos: Cortesía de Louis Jammes. La figura de Ted Parker fue crucial para la creación de Armonía."
      },
      {
        "src": "/images/cronica-30/1994-12-sc-supplement-du-dimanche-de-el-dia.webp",
        "pie": ""
      }
    ]
  },
  {
    "t": "cita",
    "texto": "“En sus maletas debieron haber quedado todo lo que nos traía”, rememora Jammes más de tres décadas después."
  },
  {
    "t": "parrafo",
    "html": "La pérdida fue un duro golpe, pero también una razón más para consolidar Armonía. Mantener viva la organización significaba, en cierta forma, dar continuidad a los ideales que Parker había compartido con Jammes y al compromiso que lo había llevado a dedicar su vida a la protección de la naturaleza."
  },
  {
    "t": "parrafo",
    "html": "“Recuerdo que Ted siempre se quejaba de lo poco que se hacía para la conservación frente a la veloz ola de destrucción en el continente. Se apresuraba, de país en país, como si le faltara tiempo. Ha dado su vida por ello”, escribió Jammes por aquellos años al retratar a Parker, a quien también consideraba un amigo."
  },
  {
    "t": "parrafo",
    "html": "“Tu paso por Bolivia no habrá sido en vano. Que descanses con el Guajojó. Nosotros haremos que siga cantando”, le dedicó en un artículo de homenaje titulado <i>Recordando a Ted Parker</i>."
  },
  {
    "t": "subtitulo",
    "texto": "Los primeros pasos"
  },
  {
    "t": "parrafo",
    "html": "En enero de 1993, sin más recursos que una creatividad  inagotable y una profunda vocación por el cuidado de la naturaleza, el primer equipo de Armonía a la cabeza de Louis Jammes puso en marcha una labor que por entonces parecía improbable: despertar el interés por las aves y difundir la extraordinaria riqueza de la avifauna boliviana para motivar una conciencia ambiental entre las y los bolivianos, en una época en la que poco se hablaba de ecologismo o de la protección del medioambiente."
  },
  {
    "t": "parrafo",
    "html": "Para lograrlo arrancaron con lo que tenían a mano, sin esperar condiciones ideales ni recursos extraordinarios."
  },
  {
    "t": "parrafo",
    "html": "“Al principio no teníamos nada, ni oficinas” cuenta Jammes y agrega que para subsanar ese vacío ofreció su casa, ubicada en el barrio cruceño La Madre. Allí, en su dormitorio y sentados sobre una cama, los fundadores comenzaron a dar forma, casi de manera artesanal, a una organización que, con el tiempo, se convertiría en el principal referente de la conservación de aves en Bolivia."
  },
  {
    "t": "parrafo",
    "html": "De hecho, cuando llegó el momento de elegir una imagen que identificara a Armonía, optaron por el <i>Elanoides forticatus</i>, una pequeña ave rapaz, debido a una razón práctica. “Sencillamente porque es un ave enteramente en blanco y negro. Y nosotros no teníamos impresora a color en esa época”, detalla."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/logo-para-pintar-sobre-la-avioneta-de-lucho-768x1023.webp",
    "pie": "Foto: cortesía de Louis Jammes. Uno de los primeros bocetos del logo de Armonía, el Elanoides Forticatus."
  },
  {
    "t": "parrafo",
    "html": "El emblema no solo apareció en boletines, cartas y documentos. También fue pintado en la avioneta que Jammes había destinado a apoyar el trabajo científico y conservacionista. Con ella transportaba investigadores a distintas regiones de Bolivia por tarifas reducidas. A donde llegaban esas expediciones, llegaba también el nombre de Armonía."
  },
  {
    "t": "parrafo",
    "html": "Jammes asegura que la iniciativa se sostuvo gracias a la entrega incondicional de sus integrantes. Nadie recibía un sueldo. Cada uno aportaba horas de trabajo, entusiasmo y, en la medida de sus posibilidades, dinero de su propio bolsillo para impulsar el proyecto. “En realidad no teníamos nada, salvo un gran entusiasmo y el apoyo de mucha gente. Pobres, pero con muchísimas ideas, éramos felices”."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/1993-trompillo-le-maule.webp",
    "pie": "Foto: Cortesía de Louis Jammes. La avioneta en la que el entonces director y fundador de Armonía, Louis Jammes, pintó el logo de Armonía."
  },
  {
    "t": "subtitulo",
    "texto": "Inicio de actividades"
  },
  {
    "t": "parrafo",
    "html": "El primer año de Armonía fue intenso. Entre las primeras tareas que asumió la organización estuvo la elaboración de la lista de las <i>aves</i> registradas en Bolivia. Tras un minucioso trabajo de investigación, lograron clasificar 1.336 especies en un cuadernillo cosido a mano titulado Aves<i> de Bolivia</i>. La publicación se convirtió en una herramienta pionera e indispensable para observadores, investigadores y amantes de las aves del país."
  },
  {
    "t": "parrafo",
    "html": "A la par, crearon el primer grupo de observadores de aves de Bolivia, integrado por 40 miembros. También impulsaron un centro de datos sobre la avifauna boliviana, y tejieron una red internacional de contactos a los que llamaban “antenas”: personas que compartían información, difundían las actividades de Armonía y mantenían a la organización conectada con observadores de aves, investigadores y conservacionistas de distintas partes de Bolivia y el mundo."
  },
  {
    "t": "parrafo",
    "html": "Entre esas “antenas” figuraban Luis Rea, en La Paz (Bolivia), Robin Foster y Louise Emmons, en Estados Unidos; Adrián Azpiroz, en Uruguay; Julio Rafael Contreras, en Argentina; Yuri Machado, en Brasil; Jesús Guerrero, en España; y Robin Brace, en Inglaterra."
  },
  {
    "t": "parrafo",
    "html": "En ese tiempo, Armonía también ofreció a numerosos estudiantes de Biología de la Universidad Autónoma Gabriel René Moreno la oportunidad de impulsar y liderar sus propios proyectos de conservación. Según Jammes, pocas organizaciones brindaban entonces ese nivel de confianza y protagonismo a jóvenes investigadores."
  },
  {
    "t": "parrafo",
    "html": "“Si uno de los estudiantes llegaba a Armonía con un proyecto y estábamos de acuerdo, buscábamos cómo financiarlo, pero el director del proyecto era el propio estudiante que lo había presentado”."
  },
  {
    "t": "parrafo",
    "html": "Pronto el dinamismo de Armonía no tardó en llamar la atención más allá de las fronteras bolivianas. En su primer año de actividades, BirdLife International invitó a Armonía a convertirse en su organización asociada en Bolivia, incorporándola a una de las redes de conservación de aves más importantes del mundo."
  },
  {
    "t": "parrafo",
    "html": "El respaldo quedó reflejado en una carta enviada a la organización el 30 de noviembre de 1993, en la que BirdLife afirmaba: «Consideramos que Armonía no es solamente la organización que lidera la conservación de aves en Bolivia, sino la organización boliviana de conservación más representativa de nuestros intereses y la de mayor expectativa de crecimiento»."
  },
  {
    "t": "parrafo",
    "html": "Ese reconocimiento llegaba acompañado de nuevos desafíos. Muy pronto, Armonía asumiría el que sería su primer gran proyecto de investigación."
  },
  {
    "t": "subtitulo",
    "texto": "La Paraba Barba Azul, el primer gran fondo"
  },
  {
    "t": "parrafo",
    "html": "Casi al mismo tiempo que Armonía comenzaba a abrirse camino, el científico estadounidense Charles Munn, de la Wildlife Conservation Society, había confirmado la supervivencia de la Paraba Barba Azul (<i>Ara glaucogularis</i>), un ave endémica de Bolivia que por entonces se creía al borde de la extinción."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/Barba-azul-4.webp",
    "pie": "Foto: Dos Parabas Barba Azul posan en un árbol de motacú en la Reserva Laney Rickman. Jhulian Machuca, Armonía."
  },
  {
    "t": "parrafo",
    "html": "Tan pronto se conoció que la especie aún sobrevivía en Bolivia, surgió la necesidad de conocer mejor su distribución y estado de conservación. Munn tomó entonces contacto con Armonía y, durante una reunión con Louis Jammes y Érika Cuéllar, otorgó a la joven organización un fondo de investigación de 8.000 dólares para realizar el primer relevamiento de esta fascinante ave, reconocible por los tonos turquesa y azul de sus alas y el amarillo brillante de su pecho."
  },
  {
    "t": "parrafo",
    "html": "Para llevar adelante aquel estudio, Armonía incorporó a un nuevo voluntario, Alan Hesse, ciudadano británico y francés,  proveniente de Francia: Alan Hesse, quien entonces estudiaba estudiante de Ciencias del Comportamiento en la Universidad de Nottingham (Reino Unido, Gran Bretaña) y quien a. Años más tarde se convertiría en biólogo de la conservación y autor de la galardonada serie gráfica <a href=\"https://captainpoloacademy.com/the-adventures-of-captain-polo/\"><i>Las aventuras del Capitán Polo</i></a>. Junto a él, los integrantes de la organización emprendieron la búsqueda de la esquiva <i>Ara glaucogularis</i> en el norte, este y sur de Trinidad. La investigación se prolongó durante cinco meses, entre julio y noviembre de 1993."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/Reunion1.jpg",
    "pie": "Foto: Cortesía de Louis Jammes. De izquierda a derecha, Alan Hesse, Ericka Cuellar, Louis Jammes y su esposa Lourdes Gutierrez."
  },
  {
    "t": "parrafo",
    "html": "Realizar aquel estudio fue una verdadera aventura. En una época en la que no existían sistemas de GPS de uso generalizado ni acceso a internet, y cuando los recursos económicos eran extremadamente limitados, el equipo tuvo que arreglárselas con lo indispensable. «No teníamos nada. Yo ni siquiera tenía carpa. Andaba con un mosquitero hecho de cortina, una mochila, un machete y unos binoculares que eran de mi padre, de los años cincuenta. Así empezamos», recuerda Hesse."
  },
  {
    "t": "parrafo",
    "html": "Tras varias semanas de búsqueda, el equipo obtuvo resultados. Según Hesse, encontraron poblaciones muy aisladas, de dos a tres individuos. La mayor parte de la especie no habitaba en áreas protegidas sino en grandes estancias o extensiones de tierra ganadera cuyos dueños “no eran para nada simpatizantes con la conservación debido a que tenían un enfoque puramente extractivista”."
  },
  {
    "t": "parrafo",
    "html": "También identificaron un problema menos visible: la mayoría de la población local desconocía la singularidad y el estado crítico de conservación de la Paraba Barba Azul. En algunos casos, ni siquiera se la distinguía de otras parabas de la región. Como muestra de las consecuencias que podía tener esa falta de información, Hesse relató —-en su artículo “Buscando a la Paraba Barba Azul”—-el caso de dos jóvenes que, según un profesor de una comunidad rural beniana, mataron a una Paraba Barba Azul para utilizarla como carnada de pesca."
  },
  {
    "t": "parrafo",
    "html": "Para contrarrestar esa situación, el equipo comprendió que primero debía lograr que la gente conectara con aquella ave única en el mundo. Durante sus recorridos por la región compartieron víveres con los pobladores y repartieron dibujos de la Paraba Barba Azul junto con cajas de colores para los niños. Esas actividades les permitieron entablar conversaciones con las familias sobre la importancia de la especie y despertar un sentimiento de orgullo por albergar en sus tierras a un ave que no existe en ningún otro lugar del planeta. Al mismo tiempo, ayudaron a que los más pequeños aprendieran a reconocerla y valorarla."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/Ninos-EC-1996-copy.webp",
    "pie": "Foto: Cortesía de Louis Jammes. Un grupo de niños sostiene los dibujos que hicieron para diferenciar a las aves de sus comunidades."
  },
  {
    "t": "parrafo",
    "html": "Más adelante, entre 1994 y 1996, la organización cosechó nuevos logros. Difundieron dos boletines informativos y dos números de la revista anual <a href=\"https://drive.google.com/drive/u/1/folders/1f-THgXEvWNLo2bLPl1Y9FN2vRquginhS\"><i>Guajojo</i></a>. Continuaron incorporando a más miembros, entre ellos los ornitólogos Miguel Ángel Arrivas y Francisco Sagot, quienes fortalecieron el trabajo científico de la institución. Gracias a una donación de 20.000 dólares otorgada por el entonces embajador británico en Bolivia, Michael Jackson, lograron alquilar una oficina en el primer anillo de Santa Cruz."
  },
  {
    "t": "parrafo",
    "html": "En esos mismos años, la relación de Armonía con BirdLife International también abrió las puertas a un valioso aporte académico. El reconocido ornitólogo británico David Snow decidió donar a la organización toda su biblioteca especializada en ornitología. El cargamento, compuesto por dos toneladas de libros, llegó a Bolivia por vía marítima después de varios meses de viaje. “Sé que fueron dos toneladas porque gracias al proyecto de la Paraba Barba Azul teníamos un Jeep Mercedes con esa capacidad de carga y lo llenamos por completo con la biblioteca”, recuerda Alan Hesse."
  },
  {
    "t": "parrafo",
    "html": "La consolidación de esa primera etapa quedó sellada el 17 de agosto de 1996, cuando Armonía obtuvo su personería jurídica. Aunque el trabajo había comenzado años antes, la institución adoptó esa fecha como su nacimiento oficial."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/Louis-James.jpg",
    "pie": "Foto: Cortesía de Louis Jammes. Louis Jammes, en la primera oficina de Armonía en Santa Cruz, Bolivia."
  },
  {
    "t": "subtitulo",
    "texto": "La refundación"
  },
  {
    "t": "parrafo",
    "html": "En 2002, tras casi una década marcada por la búsqueda de la Paraba Barba Azul, Armonía abrió un nuevo capítulo de su historia de la mano de Bennett Hennessey y Sebastián Herzog, quienes asumieron la dirección ejecutiva y científica de la institución, respectivamente."
  },
  {
    "t": "parrafo",
    "html": "Para entonces, Armonía se encontraba prácticamente cerrada, afirma Herzog. Sin embargo, ambos vieron en ella una oportunidad: reconstruirla desde sus cimientos e iniciar una nueva etapa."
  },
  {
    "t": "parrafo",
    "html": "De ese tiempo, Bennett Hennessey y Sebastián Herzog recuerdan numerosos desafíos, pero coinciden en que hubo uno especialmente difícil de superar al inicio: poner en orden la administración de una entidad que buscaba reinventarse. Acostumbrados a pasar largas jornadas en el campo estudiando aves, ambos tuvieron que enfrentarse a tareas para las que su formación como biólogos no los había preparado: conseguir financiamiento, organizar las finanzas y construir una estructura institucional sólida."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/IMG_0216.webp",
    "pie": "Foto: Armonía. Bennet Hennesey, director ejecutivo de Armonía en 2002-2016, y actual director de Reservas Privadas."
  },
  {
    "t": "parrafo",
    "html": "“Esos son temas que siempre cuestan al inicio de cualquier organización. Muchas empiezan con personas como Bennett y yo: gente a la que le encantan las aves, que son biólogos o provienen de ramas afines, y que disfrutan estar en el campo estudiando pájaros. Pero cuando se trata de las leyes, la administración, las normas, el alquiler, los impuestos y todo lo demás, no tenemos ni la más remota idea”, explica Herzog."
  },
  {
    "t": "parrafo",
    "html": "Sin embargo, le hicieron frente a esas exigencias y, poco a poco, comenzaron a sentar las bases de la nueva Armonía. Establecieron un directorio, desarrollaron estatutos y protocolos institucionales y, gracias a la obtención de nuevos fondos, crearon el departamento administrativo y contable. También adquirieron el predio donde actualmente se encuentra la oficina de Armonía en Santa Cruz."
  },
  {
    "t": "parrafo",
    "html": "En ese proceso, Bennett Hennessey destaca que el apoyo de su esposa, Ruth Alipaz, fue decisivo. Alipaz, que entonces estudiaba Administración de Empresas, le sugirió contratar a un administrador para hacerse cargo de un área que ninguno de los fundadores dominaba. “La primera cosa que hice, y eso fue sugerencia de mi esposa, fue buscar un administrador. Ella me dijo: ‘Tú necesitas un administrador. No sabes todo eso de los informes financieros y la gestión administrativa'”. Siguiendo ese consejo, uno de los primeros profesionales a los que convocaron fue Grover Bravo, quien asumió la administración de Armonía. “Desde ahí crecimos rápido, porque demostramos que éramos una organización más sólida”, recuerda Hennessey."
  },
  {
    "t": "parrafo",
    "html": "Con una estructura institucional más fortalecidasólida, Armonía estuvo en condiciones de ampliar su horizonte de trabajo. Para Hennessey y Herzog el desafío ya no consistía únicamente en fortalecerla, sino también en redefinir su papel."
  },
  {
    "t": "parrafo",
    "html": "Hasta entonces, gran parte de sus esfuerzos habían estado orientados a la observación de aves, la investigación científica y la difusión del conocimiento sobre la avifauna boliviana. Esas actividades seguían siendo fundamentales, pero ambos comprendieron que no eran suficientes. Conocer las especies y documentar su situación era apenas el primer paso; si se quería frenar su declive, era necesario traducir ese conocimiento en acciones concretas de conservación."
  },
  {
    "t": "parrafo",
    "html": "Ese pensamiento marcó un giro en la historia de Armonía. A partir de entonces, comenzó a combinar la investigación científica con iniciativas destinadas a proteger las especies más amenazadas y sus hábitats, incorporando además un fuerte componente de trabajo con comunidades indígenas y campesinas."
  },
  {
    "t": "parrafo",
    "html": "Bennett Hennessey afirma que ese cambio también implicó replantear su propia manera de entender la conservación. “En esa época yo era un biólogo que venía de afuera y pensaba que conservar era trabajar en el campo, crear reservas, y mantener a la gente fuera. Pero varios de los coordinadores bolivianos me hicieron ver que eso no bastaba. Ellos entendían que había que involucrar a las comunidades; no podía ser solamente un proyecto en el campo”."
  },
  {
    "t": "parrafo",
    "html": "El programa de conservación del Mamaco lo ayudó a comprender esa realidad desconocida para él. Uno de los coordinadores, Hugo Aranibar, le propuso destinar parte del presupuesto para que una comunidad indígena pudiera tramitar sus documentos de identidad. Al principio la idea le pareció extraña. “Pensé: estamos protegiendo pájaros, ¿qué tiene que ver esto con la conservación? Pero confié en él”, cuenta Hennessey. Con el tiempo comprendió que aquella decisión había permitido a la comunidad fortalecer el reconocimiento de su territorio y, posteriormente, crear el Refugio Mamaco. “Ahí entendí que ayudar a la gente también es hacer conservación”, concluye."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/male_mamaco_mileniusz.webp",
    "pie": "Foto: Un Paujil Carunculado, más conocido como Mamaco posando en la copa de un árbol"
  },
  {
    "t": "parrafo",
    "html": "El respaldo de BirdLife International fue decisivo para materializar esta nueva visión. Gracias a su apoyo, Armonía puso en marcha una serie de programas dirigidos a la conservación de especies amenazadas y ecosistemas prioritarios del país. Entre ellos se encontraban las iniciativas para las Áreas Importantes para la Conservación de las Aves (IBA), así como los programas dedicados a la Paraba Frente Roja, la Paraba Barba Azul, la Monterita Cochabambina, la Pava Copete de Piedra, Mamaco y los bosques de <i>Polylepis</i>, entre otros."
  },
  {
    "t": "parrafo",
    "html": "A la par, estos proyectos se convirtieron en una plataforma para que una nueva generación de biólogos y conservacionistas bolivianos incursionaran en la protección de la avifauna amenazada de Bolivia. Uno de ellos es Rodrigo Soria, quien conoció a Armonía, en 2003, gracias a su entonces tutor de tesis, Sebastián Herzog. Apenas concluyó sus estudios en la Universidad Mayor de San Simón, Herzog lo invitó a incorporarse a la institución para hacerse cargo de diversos proyectos de investigación."
  },
  {
    "t": "parrafo",
    "html": "Sin dudarlo, Soria aceptó el desafío y, gracias a su trabajo, se alcanzó uno de los hitos más importantes de aquella etapa: el redescubrimiento de la Pava Copete de Piedra <i>(Pauxi unicornis),</i> una especie en Peligro Crítico de Extinción, en los bosques montanos húmedos del área protegida y territorio indígena Isiboro Sécure."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/Observadores_Marton-Hardy-_-Asociacion-Armonia2.webp",
    "pie": "Foto: Rodrigo Soria, Marcia Salvatierra y Teodoro Camacho en un avistamiento de aves durante un Global Big Day. Marton Hardy, Armonía"
  },
  {
    "t": "parrafo",
    "html": "“Hay que tomar en cuenta que es una especie que está en una zona bastante difícil para trabajar. Pese a ello, lo que logramos fue primero entender mejor la distribución de esta ave, los niveles de amenaza —que no eran los mismos en todos los sitios donde se conocía su presencia— y conseguir la adhesión de algunos socios locales, algo que muchos creían imposible”, rememora."
  },
  {
    "t": "parrafo",
    "html": "Tras varios años de trabajo, Soria dejó la institución en septiembre de 2005 y un breve periodo en el que se alejó de Armonía para cursar sus estudios de posgrado en el extranjero. Regresó en junio de 2011 como , Soria regresó a la institución en 2011 comosupervisor director de programas y . Pposteriormente, en 2017, asumió la dirección ejecutiva. Desde entonces ha encabezado un equipo comprometido con la conservación de las aves y sus hábitats, dando continuidad a una misión que desde siempre ha sido el faro que guía a Armonía: crear equilibrio entre la gente y la naturaleza."
  },
  {
    "t": "parrafo",
    "html": "Bajo su liderazgo, la organización ha fortalecido y ampliado sus programas de conservación, al tiempo que ha consolidado su presencia en el ámbito nacional. “En este periodo hemos visto una diversificación y fortalecimiento de varios programas. Hemos incrementado nuestra incidencia nacional en ámbitos que no habíamos incidido de manera firme, con cooperaciones, con otras organizaciones nacionales e internacionales, un apoyo más sólido al SERNAP y una mayor incidencia en tomadores de decisiones locales, regionales y nacionales”, afirma Soria."
  },
  {
    "t": "parrafo",
    "html": "Para Soria, aunque aún quedan importantes desafíos por delante, Armonía ha contribuido de manera decisiva a transformar la conservación de aves en Bolivia. No sólo ha impulsado investigaciones y programas para proteger a las diversas especies de aves amenazadas, sino que también ha ayudado a formar nuevas generaciones de conservacionistas, fortalecer alianzas con comunidades locales y posicionar al país como un referente regional en la protección de la biodiversidad."
  },
  {
    "t": "parrafo",
    "html": "Ese recorrido se refleja en decenas de proyectos, investigaciones y esfuerzos colectivos que marcaron la historia de la institución. Sin embargo, resumir todo lo alcanzado en una sola historia sería imposible. Al mirar hacia atrás, sus integrantes coinciden en destacar algunos hitos que permiten dimensionar con especial claridad el impacto de ese trabajo."
  },
  {
    "t": "subtitulo",
    "texto": "El caso de la Paraba Barba Azul, una historia de éxito"
  },
  {
    "t": "parrafo",
    "html": "“La misión de Armonía es evitar la extinción de especies y, a lo largo de toda nuestra historia, hemos logrado algo que muy pocas organizaciones conservacionistas en el mundo pueden decir: revertir la tendencia poblacional de una especie que iba camino a la extinción”, afirma Soria."
  },
  {
    "t": "parrafo",
    "html": "La Paraba Barba Azul es quizá el mejor ejemplo de ello. A comienzos de la década de 1980 se pensó que esta especie endémica de las sabanas del Beni había desaparecido. Durante los años noventa apenas se conocían unos pocos individuos y, ya en los 2000, algunas estimaciones situaban su población entre 125 y 150 ejemplares en estado silvestre. Sin embargo, gracias al censo nacional realizado por Armonía en 2015, se confirmó que la población se acercaba a los 450 individuos. Y, para 2025, las estimaciones la sitúan cerca de los 600 800."
  },
  {
    "t": "parrafo",
    "html": "Ese crecimiento de la población de la Paraba Barba Azul, a decir de Soria, fue posible gracias a una serie de acciones que Armonía impulsó. Una de ellas ocurrió en 2008. Hasta entonces, recuerda Bennett Hennessey, la especie era conocida únicamente por parejas dispersas a lo largo de las sabanas benianas. “Era una pareja aquí, otra a una hora de caballo. Nunca habíamos visto un grupo grande.”"
  },
  {
    "t": "parrafo",
    "html": "La historia cambió cuando Hennessey y Mauricio Herrera obtuvieron financiamiento para explorar una zona remota a la que nadie había llegado debido al alto costo que implicaba acceder a ella. Allí, Herrera Carrera encontró 17 diez Parabas Barba Azul reunidas en un mismo sitio, el grupo más numeroso registrado hasta entonces."
  },
  {
    "t": "parrafo",
    "html": "“En esa época 17diez individuos juntos era algo increíble. Mauricio me llamó y me dijo: ‘Hemos encontrado el grupo más grande de Parabas Barba Azul y el dueño quiere vender la estancia'”, recuerda Hennessey."
  },
  {
    "t": "parrafo",
    "html": "Para Tjalle Boorsma, director de Desarrollo de Armonía, “siempre se encontraban una pareja, dos parejas, o una pareja con su pichón, pero nunca grupos, eso fue la gran cosa, pues Mauricio Herrera en 2006 o 2007 hizo un gran recorrido por gran parte del Beni y en la reserva Barba Azul encontró un grupo de 17 parabas, fue una de las primeras veces o la primera vez que encontraron un grupo grande, algo que no han observado en ninguna otra parte. Y eso fue la razon por la que Armonía decidió comprarla.”."
  },
  {
    "t": "parrafo",
    "html": "Agrega que “en ese momento no se sabía nada de los movimientos de la Paraba Barba Azul. Ahora sabemos que en la reserva hay más de 200 individuos alimentándose en los bosques de galería y que, gracias a todo el conocimiento generado por el monitoreo, se agrupan allí y luego se dispersan hacia otros lugares fuera del área para anidar. Pero esa información no existía en el pasado; es un conocimiento que hemos adquirido durante los últimos 10 a 15 años”."
  },
  {
    "t": "parrafo",
    "html": "Tras conocer esa información, Hennessey cuenta que contactó a World Land Trust, Rainforest Trust y American Bird Conservancy, y les planteó financiar la compra del predio. La respuesta fue positiva y en 2008, Armonía inauguró la Reserva Natural Barba Azul, un sitio único dedicado a conservar a la Paraba Barba Azul."
  },
  {
    "t": "parrafo",
    "html": "Sin embargo, esa no fue la única arista de la estrategia que Armonía echó a andar para revertir la extinción de la especie. Tres años antes, en 2005, Armonía había puesto en marcha el Programa de Cajas Nido, una iniciativa destinada a aumentar el éxito reproductivo de la <i>Ara glaucogularis</i><i>l</i>a Paraba Barba Azul Críticamente amenazada por el tráfico ilegal, la caza y la pérdida de su hábitat. Durante más de una década, las cajas nido fueron instaladas en una estancia privada, a la que el equipo podía ingresar únicamente con autorización de sus propietarios."
  },
  {
    "t": "parrafo",
    "html": "Es ahí donde surge la figura de la activista Laney Rickman. Apasionada defensora de la Paraba Barba Azul, conoció el trabajo que Armonía realizaba en Bolivia en 2005 y decidió convertir su conservación en una causa personal. Gracias a las gestiones que realizó para movilizar apoyo internacional, fue posible reunir los recursos necesarios para adquirir 650 hectáreas de la antigua estancia Esperancita en 20172018."
  },
  {
    "t": "parrafo",
    "html": "Aunque Laney falleció antes de ver concretado ese proyecto, la reserva creada en esos predios fue nombrada en su honor: la Reserva Natural Laney Rickman. Su hermana, Dorothy Paterson, continuó gestionando el apoyo financiero desde Estados Unidos y, años después, llevó sus cenizas hasta ese lugar. Desde entonces descansan en la reserva que lleva su nombre, mientras nuevas generaciones de Parabas Barba Azul encuentran allí un refugio seguro para reproducirse y asegurar la continuidad de la especie."
  },
  {
    "t": "parrafo",
    "html": "Los resultados de esa estrategia hablan por sí solos. Lo que comenzó como un experimento terminó convirtiéndose en una de las herramientas más eficaces para evitar la extinción de la especie. A la fecha de publicación de este reportaje, 183 pichones han logrado abandonar con éxito los nidos artificiales desde el inicio del Programa de Cajas Nido. Solo en la temporada 2025-2026, 19 polluelos emprendieron su primer vuelo, igualando la cifra más alta registrada hasta ahora, alcanzada en la temporada anterior. El impacto ha sido tan significativo que hoy se estima que casi una de cada cuatro Parabas Barba Azul que viven en libertad nació en una caja nido instalada por Armonía."
  },
  {
    "t": "parrafo",
    "html": "Pero ese logro no sería posible sin el trabajo cotidiano de los guardaparques que, durante años, han construido, instalado y monitoreado las cajas nido."
  },
  {
    "t": "parrafo",
    "html": "Uno de ellos es César Flores, guardaparque de la Reserva Natural Laney Rickman desde 2009. A lo largo de estos años no solo ha participado en el monitoreo de la Paraba Barba Azul, sino que también ha perfeccionado la construcción de las cajas nido. Recuerda que los primeros modelos tenían una abertura demasiado amplia, por lo que eran ocupados por búhos, patos y otras especies. Con el tiempo, redujo el diámetro de la entrada a 11 centímetros, permitiendo que fueran utilizadas casi exclusivamente por la Paraba Barba Azul."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/DSC_0046.webp",
    "pie": "Foto: Cesar Flores Aguilera junto a Cesar Flores Ohara durante un monitoreo a las Cajas Nido de Paraba Barba Azul. Teodoro Camacho, Armonía"
  },
  {
    "t": "parrafo",
    "html": "“Eso es lo que más hemos aprendido con Armonía. Ahora son los nidos que hacemos nosotros y, gracias a Dios, nos está funcionando. Todos los años tenemos 18 o 19 pichones.”"
  },
  {
    "t": "parrafo",
    "html": "Para Flores, observar cómo los polluelos abandonan los nidos artificiales es la mayor recompensa después de meses de trabajo."
  },
  {
    "t": "parrafo",
    "html": "“Es lo más lindo que podemos ver, porque es el fruto que nos están produciendo esas cajas nido.”"
  },
  {
    "t": "galeria",
    "fotos": [
      {
        "src": "/images/cronica-30/atw3-2.webp",
        "pie": ""
      },
      {
        "src": "/images/cronica-30/Guarda.jpg",
        "pie": ""
      }
    ]
  },
  {
    "t": "subtitulo",
    "texto": "Aviturismo para conectar a las comunidades de Omereque con la Paraba Frente Roja"
  },
  {
    "t": "parrafo",
    "html": "Cuando Filemón Soto Gómez  llegó a la comunidad de San Carlos en Cochabamba, la Paraba Frente Roja <i>(Ara rubrogenys)</i>, una especie endémica de Bolivia y en peligro crítico de extinción, era vista como una amenaza. Nadie imaginaba entonces que, décadas después, esa misma ave se convertiría en un símbolo de orgullo y en un aliado para mejorar la vida de las familias de la región."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/2023-Nov21-Red-fronted-Macaw14.webp",
    "pie": "Foto: Dos Parabas Frente Roja se acicalan sobre una rama. Rodrigo Soria, Armonía."
  },
  {
    "t": "parrafo",
    "html": "«Llegué a San Carlos en 1979, cuando todo esto era mucho más boscoso. Llovía más y el paisaje era muy distinto. Con el tiempo comenzó la deforestación, llegaron las sequías y todo fue cambiando. La Paraba Frente Roja siempre estuvo aquí, pero nosotros la veíamos como un animal dañino porque arruinaba los cultivos de maíz y maní. Queríamos que desapareciera, porque no sabíamos el valor que tenía. Normalmente se alimentaba de plantas nativas, como el quebracho y el soto. Pero había épocas en las que ya no encontraba alimento y entonces entraba a los cultivos. Antes la gente iba a espantarla o a matarla. Ahora ya no; ahora la cuidamos.»"
  },
  {
    "t": "parrafo",
    "html": "Ese cambio de percepción no ocurrió por casualidad. Fue el resultado de años de trabajo junto a las comunidades, en los que Armonía promovió una idea que al principio parecía difícil de imaginar: que conservar las aves también podía generar oportunidades para quienes convivían con ellas."
  },
  {
    "t": "galeria",
    "fotos": [
      {
        "src": "/images/cronica-30/DSC0947.webp",
        "pie": ""
      },
      {
        "src": "/images/cronica-30/DSC0973.webp",
        "pie": ""
      }
    ]
  },
  {
    "t": "parrafo",
    "html": "Ese cambio comenzó a gestarse a inicios de la década de los 2000, cuando Armonía llegó a Omereque atraída por la extraordinaria avifauna de la región. Bennett Hennessey y Sebastián Herzog identificaron allí una de las poblaciones de Paraba Frente Roja y comprendieron que su conservación dependía tanto de proteger el hábitat como de involucrar a las comunidades que convivían con ella."
  },
  {
    "t": "parrafo",
    "html": "En 2005, la institución recuperó un espacio comunitario donde hoy se encuentra la Reserva Natural Comunitaria Frente Roja, de 50 hectáreas, e inició un trabajo conjunto con las comunidades de San Carlos, Perereta y Amaya. Con el paso de los años, ese proceso permitió que las tres comunidades asumieran la propiedad de esta área y su gestión. La apuesta fue distinta a la de muchos proyectos tradicionales de conservación: optaron por impulsar el turismo comunitario y la observación de aves para que los propios pobladores encontraran en la protección de la Paraba Frente Roja una oportunidad de desarrollo y, con el tiempo, asumieran el liderazgo del proyecto."
  },
  {
    "t": "parrafo",
    "html": "Para Iván Pérez Hurtado, actual director administrativo que se incorporó a Armonía en 2007, esa forma de trabajar es precisamente lo que ha distinguido a la organización de muchas otras dedicadas a la conservación. En lugar de llegar con proyectos preconcebidos, Armonía procura comprender el contexto social y económico de cada comunidad, escuchar sus necesidades y construir soluciones de manera conjunta."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/DSCN0761.webp",
    "pie": "Ivan Pérez, durante un avistamiento de aves en el Beni hace más de 10 años. Foto archivo."
  },
  {
    "t": "parrafo",
    "html": "“Nosotros no vamos con una receta para preservar especies amenazadas. Primero entendemos a las comunidades, cómo piensan y cuáles son sus necesidades”, explica. A su juicio, muchas iniciativas fracasan porque nacen “desde una torre de marfil” y luego intentan implementarse sin una participación real de la población local."
  },
  {
    "t": "parrafo",
    "html": "Esa misma lógica también orienta la forma en que Armonía busca financiamiento para sus proyectos. “En inglés hay un término, <i>donor driven</i>. Hay un donante que financia determinada temática y muchas organizaciones terminan cambiando incluso sus objetivos para acceder a esos recursos. Armonía no”, enfatiza. En lugar de adaptar su misión a las oportunidades de financiamiento, la institución busca recursos para desarrollar proyectos que respondan a las necesidades identificadas en el territorio."
  },
  {
    "t": "parrafo",
    "html": "Por esa misma razón, el trabajo no concluye cuando termina un convenio o se agotan los fondos. El objetivo, dice Pérez, es permanecer el tiempo necesario para que las comunidades se apropien de los proyectos y puedan sostenerlos de manera autónoma."
  },
  {
    "t": "parrafo",
    "html": "La Reserva Natural Comunitaria Frente Roja resume esa visión. Allí, el comité de administración de la Reserva Comunitaria, integrado por los propios comunarios, decide el manejo del área protegida, mientras Armonía acompaña el proceso como asesora. “Nosotros hemos sido una especie de asesores; realmente ellos son nuestros jefes”, dice Pérez. Más que un proyecto de conservación, la Reserva representa una forma de trabajo en la que las comunidades terminan convirtiéndose en las verdaderas protagonistas."
  },
  {
    "t": "subtitulo",
    "texto": "La alianza entre ganaderos y conservacionistas, una utopía que se hizo realidad"
  },
  {
    "t": "parrafo",
    "html": "En la década de 1990, convencer a los ganaderos del Beni de que la conservación de la Paraba Barba Azul también podía beneficiarles parecía una idea imposible. Cuando apenas comenzaban los esfuerzos por proteger a la especie, Alan Hesse buscó una forma de involucrar a los propietarios de las estancias donde sobrevivían los últimos ejemplares conocidos."
  },
  {
    "t": "parrafo",
    "html": "Con el apoyo de BirdLife International organizó un acto en Trinidad para reconocer a los siete ganaderos que albergaban en sus predios a la Paraba Barba Azul <i>A</i><i>ra glaucogularis</i>. La entonces presidenta honoraria de BirdLife y reina de Jordania firmó, junto a las autoridades bolivianas, unos certificados diseñados por el mismo Hesse que los distinguían como “Guardianes de la Paraba Barba Azul”. La expectativa era que ese reconocimiento despertara su interés por proteger a la especie."
  },
  {
    "t": "parrafo",
    "html": "Sin embargo, pasar de esa primera aproximación a una verdadera alianza entre ganaderos y conservacionistas tomaría muchos años. Fue dos décadas después cuando comenzó a gestarse un cambio de enfoque que transformaría la relación entre Armonía y los productores del Beni."
  },
  {
    "t": "parrafo",
    "html": "Rodrigo Soria recuerda que la idea de trabajar de manera conjunta con los ganaderos resurgió en 2016, junto con Gustavo Sanches. Ese año, Armonía organizó el primer encuentro sobre ganadería con el propósito de sembrar entre los productores la idea de que la actividad ganadera podía ser compatible con la protección de la vida silvestre."
  },
  {
    "t": "parrafo",
    "html": "“La idea de trabajar con los ganaderos renació con Gustavo Sanches y conmigo. De hecho, en 2016 organizamos el primer encuentro de ganadería con el objetivo de plantar la semilla en los ganaderos de que la ganadería es compatible con la protección de la vida silvestre”."
  },
  {
    "t": "parrafo",
    "html": "Para ese encuentro, la organización invitó a ganaderos y conservacionistas de Argentina, Paraguay y México. A diferencia del reconocimiento que Armonía había promovido más de dos décadas antes, esta vez el objetivo era que los productores benianos conocieran experiencias exitosas de otros ganaderos."
  },
  {
    "t": "parrafo",
    "html": "“Lo que nosotros queríamos era que los ganaderos escucharan de otros ganaderos las experiencias que tienen fusionando la conservación de la biodiversidad con la productividad”."
  },
  {
    "t": "parrafo",
    "html": "Ese cambio de visión también se reflejó en las propias reservas de Armonía. La organización decidió incorporar la ganadería como parte de su modelo de conservación, una decisión que, según Soria, respondió tanto a criterios económicos como legales."
  },
  {
    "t": "parrafo",
    "html": "“La idea de hacer ganadería en nuestros predios también nació de Gustavo Sanches y de mí. Teníamos dos argumentos para esto: primero, ambos veíamos que el turismo no tenía las posibilidades de generar una cantidad significativa de fondos para la reserva; y, segundo, debíamos cumplir con la Función Económica Social (FES), es decir, hacer ganadería o enfrentar una posible reversión de las tierras”."
  },
  {
    "t": "parrafo",
    "html": "Ese enfoque fue llevado al terreno por Tjalle Boorsma, quien contribuyó a convertir esa visión en acciones concretas. Uno de sus principales resultados fue la creación de la Alianza Eco Ganadera del Beni."
  },
  {
    "t": "parrafo",
    "html": "Boorsma, quien se unió en 2015 al equipo de Armonía como de la Reserva Natural Barba Azul, asumió la dirección de Conservación en 2018 y, desde 2026, se desempeña como director de Desarrollo."
  },
  {
    "t": "parrafo",
    "html": "Reconoce que incluso él llegó al Beni con una idea equivocada. Durante sus primeros años veía a la ganadería únicamente como una amenaza para la conservación. Sin embargo, el trabajo en el territorio cambió por completo su perspectiva. Comprendió que, en las sabanas benianas, el ganado también cumple un papel ecológico y que, además, mantener la actividad ganadera resulta mucho más favorable para la conservación que reemplazarla por la agricultura."
  },
  {
    "t": "parrafo",
    "html": "Tjalle Boorsma, quien se unió en 2015 al equipo de Armonía como coordinador del Programa de la Reserva Natural Barba Azul, asumió la dirección de Conservación en 2018 y, desde 2026, se desempeña como director de Desarrollo."
  },
  {
    "t": "parrafo",
    "html": "“Fue entonces cuando empecé a ver a los ganaderos como aliados de la conservación, porque mientras una propiedad siga dedicada a la ganadería, los pastizales también se mantienen”, explica."
  },
  {
    "t": "parrafo",
    "html": "Ese cambio de enfoque también transformó la relación entre Armonía y los productores. En lugar de acercarse únicamente con argumentos ambientales, la organización comenzó a demostrar, desde su propia experiencia, que era posible producir y conservar al mismo tiempo."
  },
  {
    "t": "parrafo",
    "html": "“Nosotros tenemos presencia en el territorio y hacemos ganadería. Los productores ya no nos ven solamente como una organización que habla de proteger aves; nos ven también como ganaderos. Y cuando haces ganadería hablas el mismo idioma”, afirma Boorsma."
  },
  {
    "t": "parrafo",
    "html": "Ese lenguaje común permitió construir la confianza que durante años había parecido inalcanzable. “Si usted no protege este bosque y no deja crecer los árboles, su ganado se quedará sin sombra. Un animal que pasa todo el día bajo el sol sufre más estrés y produce menos. Ahí es donde las prácticas de conservación se conectan con los beneficios económicos”, sostiene."
  },
  {
    "t": "parrafo",
    "html": "La experiencia acumulada en la Reserva Barba Azul y Laney Rickman terminó convirtiéndose en un laboratorio de soluciones. El manejo del fuego, la ganadería sostenible y la restauración de los pastizales comenzaron a atraer a otros productores, que visitaban la reserva para conocer de primera mano las prácticas implementadas por Armonía."
  },
  {
    "t": "parrafo",
    "html": "“Aprendimos haciendo, cometiendo errores y corrigiéndolos. Después pudimos acercarnos a otros productores y decirles: ‘Nosotros tuvimos los mismos problemas que ustedes. Esto es lo que hicimos. ¿Quieren venir a verlo?’”, afirma Boorsma."
  },
  {
    "t": "parrafo",
    "html": "Ese proceso desembocó años después en la creación de la Alianza Eco Ganadera del Beni, una iniciativa de Armonía y la Federación de Ganaderos del Beni (Fegabeni), que reúne a productores y  organizaciones de aliados a la conservación para promover una ganadería sostenible y demostrar que la protección de la Paraba Barba Azul y la producción ganadera no solo pueden coexistir, sino fortalecerse mutuamente. Actualmente, la alianza es presidida por Tjalle Boorsma"
  },
  {
    "t": "galeria",
    "fotos": [
      {
        "src": "/images/cronica-30/DSC_0159.webp",
        "pie": "Foto: Playeros acanelados se alimentan junto al ganado en la Reserva Barba Azul. Teodoro Camacho, Armonía"
      },
      {
        "src": "/images/cronica-30/ALIANZA-ECO-GANADERA-2024.webp",
        "pie": ""
      },
      {
        "src": "/images/cronica-30/DSC_0432.webp",
        "pie": ""
      }
    ]
  },
  {
    "t": "subtitulo",
    "texto": "La guía de aves de Bolivia, el libro que motivó la cultura pajarera"
  },
  {
    "t": "parrafo",
    "html": "Otro de los hitos que marcó la historia de Armonía fue la publicación de la primera guía moderna de las aves de Bolivia. La idea nació de una necesidad que Sebastián Herzog experimentó desde su llegada al país, en 1994, cuando comenzó el trabajo de campo para su doctorado. En ese entonces no existía una guía especializada sobre las aves bolivianas y los investigadores debían recurrir a publicaciones de otros países para identificar las especies. “Estabas parado en el bosque y no tenías ni la más remota idea de qué acababa de pasar por tus narices. Y si no sabes identificar las especies, esa es la base de todo trabajo científico y de conservación”, recuerda."
  },
  {
    "t": "parrafo",
    "html": "Aquella carencia llevó a Herzog y Bennett Hennessey a imaginar una obra que reuniera, por primera vez, el conocimiento sobre la avifauna del país. Conseguir el financiamiento tomó años y el proyecto atravesó varios contratiempos, desde la crisis económica de 2008 hasta la falta de recursos para completar la edición. Aun así, el equipo perseveró. Herzog llegó a dedicar los últimos meses del proceso a jornadas de hasta ochenta horas semanales para entregar el manuscrito final. “Trabajé como un ermitaño, de lunes a domingo”, rememora."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/DSC00028.jpg",
    "pie": "Foto: Sebastian Herzog junto a un grupo de pajareros observan aves en el Jardín Botánico en 2009"
  },
  {
    "t": "parrafo",
    "html": "Publicada finalmente en 2016 en inglés y español, la guía trascendió el ámbito científico. Además de convertirse en una referencia para investigadores y observadores de aves, abrió nuevas oportunidades para el aviturismo. La Cooperación Suiza entendió que no se trataba únicamente de un libro, sino de “una herramienta de desarrollo sostenible”, capaz de atraer visitantes, fortalecer emprendimientos locales y generar ingresos para las comunidades."
  },
  {
    "t": "parrafo",
    "html": "Después de su difusión, la guía facilitó la llegada de operadores internacionales de aviturismo, impulsó la creación de clubes de observadores de aves en Bolivia y estimuló la publicación de nuevos registros científicos sobre la distribución de especies. “Se formó, básicamente, un movimiento de observación de aves en Bolivia”, resume Herzog."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/Taller-observacion-de-aves-2023.-Daniela-Aguirre-Torres.webp",
    "pie": "Foto: Mujeres del Parque Nacional Tunari observan aves con apoyo de la Guía de Aves de Bolivia. Daniela Aguirre, Armonía"
  },
  {
    "t": "subtitulo",
    "texto": "Una misión que continúa"
  },
  {
    "t": "parrafo",
    "html": "Después de más de tres décadas, Armonía entiende que sus mayores logros no son únicamente las Reservas creadas, las especies recuperadas o las investigaciones publicadas. Detrás de cada uno de esos hitos hay un equipo de personas que comparte una misma convicción: la conservación solo es posible cuando el trabajo colectivo prevalece sobre los esfuerzos individuales."
  },
  {
    "t": "parrafo",
    "html": "Rodrigo Soria, director ejecutivo de Armonía, considera que uno de los mayores desafíos de estos años ha sido precisamente consolidar ese equipo. Explica que cada integrante tiene fortalezas, debiidades, intereses, y prioridades distintas, por lo que el reto consiste en identificar esas capacidades y ponerlas al servicio de un objetivo común."
  },
  {
    "t": "parrafo",
    "html": "“No hay dos personas iguales. Cada uno tiene sus propias cualidades y también sus debilidades. Ccomo director uno tiene que tratar de aprovechar esas cualidades. Una persona sola no llega lejos, pero en equipo es diferente. Ahí sí puedes lograr cambios”, afirma."
  },
  {
    "t": "parrafo",
    "html": "Ese proceso, añade, nunca termina. Afinar los roles, encontrar dónde cada persona puede aportar más y fortalecer el trabajo conjunto es una tarea permanente. Sin embargo, hay algo que une a quienes forman parte de Armonía. “todos comparten una genuina pasión por lo que hacen. Alguien que no cree en la misionmisión que tenemos o que no tenga esa pasión genuina no dura mucho en Armonía.”"
  },
  {
    "t": "parrafo",
    "html": "Iván Pérez Hurtado comparte esa mirada. A su juicio, la mayor fortaleza de la organización, cuyo equipo está conformado por más de 60 miembros, ha sido reunir personas profundamente comprometidas con una causa que trasciende lo laboral."
  },
  {
    "t": "parrafo",
    "html": "“Armonía tiene la fortuna de contar con un personal sumamente motivado y apasionado. Mucha gente termina contagiándose de esta manera de vivir, porque entiende que lo que hacemos tiene un impacto importante en el país y ese impacto es cada vez mayor”, sostiene."
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/DSC_0085.webp",
    "pie": "Foto: Reunión global de Asociación Armonía en 2010. Archivo."
  },
  {
    "t": "parrafo",
    "html": "Para Pérez, esa convicción colectiva explica por qué la organización ha logrado superar tantos desafíos a lo largo de su historia. Más allá de los proyectos específicos o de los recursos disponibles en cada etapa, el equipo ha mantenido una misma forma de entender la conservación: trabajar con rigor científico, construir soluciones junto a las comunidades y pensar siempre en procesos que puedan sostenerse en el tiempo."
  },
  {
    "t": "parrafo",
    "html": "Pero si algo caracteriza hoy a Armonía es la certeza de que aún queda mucho por hacer. “Hemos logrado cosas increíbles, pero todavía falta mucho trabajo”, reconoce Soria."
  },
  {
    "t": "parrafo",
    "html": "Además de los desafíos propios de la conservación, Soria advierte que existe un reto transversal que tanto Armonía como muchas otras organizaciones dedicadas a proteger la biodiversidad deben enfrentar: cerrar la brecha de financiamiento, es decir, la diferencia entre los recursos económicos que se necesitan para conservar la naturaleza y los que realmente están disponibles."
  },
  {
    "t": "parrafo",
    "html": "“Existe una brecha gigante entre la cantidad de fondos que se necesita para proteger nuestra naturaleza y la cantidad de fondos que todas las organizaciones conservacionistas manejamos. Es importante, pero realmente importante y urgente, cerrar esta brecha. Por eso Armonía comenzó a trabajar, en coordinación con sus socios, en desarrollar mecanismos de sostenibilidad financiera.”"
  },
  {
    "t": "parrafo",
    "html": "Para Soria, ese esfuerzo es indispensable porque la conservación no solo protege especies, sino que garantiza el bienestar de las personas."
  },
  {
    "t": "parrafo",
    "html": "“El propio futuro de nuestra sociedad depende de la naturaleza que nos rodea. La naturaleza nos proporciona agua, oxígeno y los nutrientes que necesitamos para producir nuestros propios alimentos. Las aves son el grupo bandera que nos ayuda a lograr esta meta.”"
  },
  {
    "t": "parrafo",
    "html": "Entre los principales desafíos, Soria menciona Entre los principales desafíos menciona reducir el uso indiscriminado del fuego en las regiones donde trabaja la organización, una de las amenazas más graves para numerosas especies y ecosistemas; impulsar la regeneración de los bosques andinos de Polylepis, fundamentales para la biodiversidad y el abastecimiento de agua de muchas comunidades; y ampliar el impacto de las acciones de conservación."
  },
  {
    "t": "parrafo",
    "html": "Para ello, Armonía ha comenzado a replantear su manera de intervenir en el territorio. Más que cambiar sus prioridades, busca ampliar su escala de acción."
  },
  {
    "t": "parrafo",
    "html": "“Las prioridades siguen siendo las mismas; las amenazas también. Lo que queremos cambiar es el enfoque: pasar de trabajar en sitios específicos a trabajar en paisajes completos para que nuestras acciones tengan un mayor impacto”, explica Soria."
  },
  {
    "t": "parrafo",
    "html": "Esa transformación también se refleja en la estructura de los programas de la institución. Pérez señala que hoy el trabajo se organiza alrededor de espacios geográficos priorizados, definidos según la presencia de las especies de aves más amenazadas del país. “Ahora trabajamos en paisajes priorizados. Las aves son excelentes indicadores de la salud de los ecosistemas y, al protegerlas, también estamos conservando todo lo que depende de esos ambientes.”"
  },
  {
    "t": "imagen",
    "src": "/images/cronica-30/Challa-nueva-aoficina.webp",
    "pie": "Foto: En la inauguración de la nueva oficina de Armonía en Cochabamba."
  },
  {
    "t": "parrafo",
    "html": "Más de treinta años después de obtener su personería jurídica —y más de tres décadas desde que un pequeño grupo de observadores de aves comenzó a imaginar una organización dedicada a proteger la avifauna boliviana—, Armonía continúa persiguiendo el mismo objetivo que inspiró a sus fundadores: evitar la extinción de aves más amenazadas de Bolivia."
  }
] as BloqueCronica[],
};
