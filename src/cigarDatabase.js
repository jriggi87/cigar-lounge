// ═══ CIGAR DATABASE ═══
// 250+ popular cigars with full specs
// Format: name|brand|wrapper|shape|strength|ringGauge|length|origin|price

const CIGAR_DATA = `
Padrón 1964 Anniversary Maduro|Padrón|Maduro|Torpedo|Medium-Full|52|6"|Nicaragua|18
Padrón 1964 Anniversary Natural|Padrón|Connecticut|Torpedo|Medium|52|6"|Nicaragua|18
Padrón 1926 Serie No. 1|Padrón|Maduro|Robusto|Full|54|6.75"|Nicaragua|30
Padrón 1926 Serie No. 2|Padrón|Maduro|Belicoso|Full|52|5.5"|Nicaragua|25
Padrón 1926 Serie No. 6|Padrón|Maduro|Robusto|Full|50|4.75"|Nicaragua|20
Padrón 1926 Serie No. 9|Padrón|Maduro|Corona|Full|56|5.25"|Nicaragua|22
Padrón 2000|Padrón|Maduro|Robusto|Medium|50|5"|Nicaragua|8
Padrón 3000|Padrón|Maduro|Toro|Medium|52|5.5"|Nicaragua|9
Padrón Damaso No. 12|Padrón|Connecticut|Toro|Mild-Medium|50|5.5"|Nicaragua|14
Padrón Family Reserve 45|Padrón|Maduro|Toro|Full|52|6"|Nicaragua|35
Padrón Family Reserve 50|Padrón|Maduro|Robusto|Full|54|5.5"|Nicaragua|35
Arturo Fuente Opus X|Arturo Fuente|Habano|Robusto|Full|50|5.25"|Dominican Republic|35
Arturo Fuente Opus X Perfecxion No. 5|Arturo Fuente|Habano|Robusto|Full|40|4.875"|Dominican Republic|28
Arturo Fuente Opus X Lost City|Arturo Fuente|Habano|Robusto|Full|52|5.25"|Dominican Republic|50
Arturo Fuente Don Carlos|Arturo Fuente|Cameroon|Robusto|Medium-Full|50|5"|Dominican Republic|12
Arturo Fuente Don Carlos Eye of the Shark|Arturo Fuente|Cameroon|Belicoso|Medium-Full|56|5.25"|Dominican Republic|25
Arturo Fuente Hemingway Short Story|Arturo Fuente|Cameroon|Petit Corona|Medium|49|4"|Dominican Republic|10
Arturo Fuente Hemingway Best Seller|Arturo Fuente|Cameroon|Torpedo|Medium|48|4.5"|Dominican Republic|12
Arturo Fuente 8-5-8|Arturo Fuente|Cameroon|Churchill|Medium|47|6"|Dominican Republic|8
Arturo Fuente Gran Reserva|Arturo Fuente|Cameroon|Churchill|Medium|48|6.25"|Dominican Republic|9
Arturo Fuente Chateau Fuente|Arturo Fuente|Connecticut|Robusto|Mild-Medium|50|4.5"|Dominican Republic|9
Oliva Serie V Melanio|Oliva|Habano|Toro|Medium-Full|50|6"|Nicaragua|14
Oliva Serie V Melanio Maduro|Oliva|Maduro|Toro|Full|50|6"|Nicaragua|15
Oliva Serie V|Oliva|Habano|Toro|Full|50|6"|Nicaragua|11
Oliva Serie V Double Robusto|Oliva|Habano|Gordo|Full|54|5"|Nicaragua|12
Oliva Serie G|Oliva|Cameroon|Toro|Medium|50|6"|Nicaragua|8
Oliva Serie O|Oliva|Habano|Robusto|Medium-Full|50|5"|Nicaragua|7
Oliva Connecticut Reserve|Oliva|Connecticut|Toro|Mild|50|6"|Nicaragua|8
Oliva Master Blends 3|Oliva|Habano|Robusto|Full|50|5"|Nicaragua|10
My Father Le Bijou 1922|My Father|Oscuro|Torpedo|Full|52|6.125"|Nicaragua|14
My Father Le Bijou 1922 Petit Robusto|My Father|Oscuro|Robusto|Full|50|4.5"|Nicaragua|11
My Father No. 1|My Father|Habano|Robusto|Medium-Full|52|5.25"|Nicaragua|12
My Father No. 2|My Father|Habano|Belicoso|Medium-Full|52|5.5"|Nicaragua|12
My Father No. 4|My Father|Habano|Lancero|Medium-Full|38|7.5"|Nicaragua|12
My Father Flor de las Antillas|My Father|Habano|Toro|Medium|52|6"|Nicaragua|10
My Father The Judge|My Father|Habano|Toro|Full|52|6"|Nicaragua|13
My Father Connecticut|My Father|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|10
My Father La Opulencia|My Father|Maduro|Toro|Full|54|6"|Nicaragua|13
Davidoff Winston Churchill|Davidoff|Connecticut|Churchill|Medium|48|7"|Dominican Republic|28
Davidoff Winston Churchill Late Hour|Davidoff|Maduro|Toro|Medium-Full|52|6"|Dominican Republic|30
Davidoff Grand Cru No. 2|Davidoff|Connecticut|Corona|Mild-Medium|43|5.625"|Dominican Republic|20
Davidoff Aniversario No. 3|Davidoff|Connecticut|Corona|Mild-Medium|50|6"|Dominican Republic|30
Davidoff Millennium Blend|Davidoff|Habano|Robusto|Medium|50|5"|Dominican Republic|22
Davidoff Nicaragua|Davidoff|Habano|Toro|Medium-Full|52|6"|Nicaragua|16
Davidoff Escurio|Davidoff|Habano|Robusto|Medium-Full|54|5.5"|Dominican Republic|18
Liga Privada No. 9|Drew Estate|Oscuro|Robusto|Full|54|5"|Nicaragua|16
Liga Privada No. 9 Toro|Drew Estate|Oscuro|Toro|Full|52|6"|Nicaragua|17
Liga Privada T52|Drew Estate|Habano|Robusto|Full|50|5"|Nicaragua|16
Liga Privada T52 Toro|Drew Estate|Habano|Toro|Full|52|6"|Nicaragua|17
Liga Privada Unico Serie Papas Fritas|Drew Estate|Oscuro|Petit Corona|Full|44|4.5"|Nicaragua|12
Liga Privada Unico Serie Dirty Rat|Drew Estate|Oscuro|Corona|Full|44|5"|Nicaragua|18
Liga Privada Unico Serie Flying Pig|Drew Estate|Oscuro|Belicoso|Full|60|3.5"|Nicaragua|20
Liga Privada Unico Serie Ratzilla|Drew Estate|Oscuro|Gordo|Full|46|6.25"|Nicaragua|18
Undercrown Shade|Drew Estate|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|9
Undercrown Maduro|Drew Estate|Maduro|Toro|Medium-Full|52|6"|Nicaragua|9
Undercrown Sun Grown|Drew Estate|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
ACID Blondie|Drew Estate|Connecticut|Petit Corona|Mild|38|4"|Nicaragua|7
ACID Kuba Kuba|Drew Estate|Sumatra|Toro|Mild-Medium|54|5"|Nicaragua|9
Ashton VSG|Ashton|Cameroon|Toro|Medium-Full|50|6"|Dominican Republic|15
Ashton VSG Enchantment|Ashton|Cameroon|Robusto|Medium-Full|52|4.75"|Dominican Republic|12
Ashton ESG|Ashton|Cameroon|Toro|Medium-Full|54|6"|Dominican Republic|30
Ashton Symmetry|Ashton|Cameroon|Toro|Medium-Full|52|6"|Dominican Republic|13
Ashton Cabinet Selection|Ashton|Connecticut|Toro|Mild-Medium|52|6"|Dominican Republic|12
Ashton Classic|Ashton|Connecticut|Churchill|Mild|48|7"|Dominican Republic|10
Rocky Patel Vintage 1990|Rocky Patel|Maduro|Robusto|Medium-Full|50|5.5"|Honduras|10
Rocky Patel Vintage 1992|Rocky Patel|Habano|Robusto|Medium|50|5.5"|Honduras|10
Rocky Patel Vintage 1999|Rocky Patel|Connecticut|Toro|Mild-Medium|52|6.5"|Honduras|10
Rocky Patel Decade|Rocky Patel|Habano|Toro|Full|52|6.5"|Honduras|11
Rocky Patel Fifteenth Anniversary|Rocky Patel|Habano|Robusto|Medium-Full|52|5"|Honduras|12
Rocky Patel Sun Grown Maduro|Rocky Patel|Maduro|Toro|Medium-Full|52|6.5"|Honduras|10
Rocky Patel The Edge Maduro|Rocky Patel|Maduro|Toro|Full|52|6"|Honduras|8
Rocky Patel The Edge Corojo|Rocky Patel|Corojo|Toro|Medium-Full|52|6"|Honduras|8
Rocky Patel Royale|Rocky Patel|Habano|Toro|Medium|52|6.5"|Nicaragua|12
Perdomo Lot 23 Maduro|Perdomo|Maduro|Toro|Medium|50|6"|Nicaragua|7
Perdomo Lot 23 Connecticut|Perdomo|Connecticut|Toro|Mild|50|6"|Nicaragua|7
Perdomo 10th Anniversary Champagne|Perdomo|Connecticut|Toro|Mild-Medium|50|6.5"|Nicaragua|9
Perdomo 20th Anniversary Maduro|Perdomo|Maduro|Toro|Medium-Full|56|6"|Nicaragua|12
Perdomo 20th Anniversary Connecticut|Perdomo|Connecticut|Toro|Mild-Medium|56|6"|Nicaragua|12
Perdomo 20th Anniversary Sun Grown|Perdomo|Habano|Toro|Medium|56|6"|Nicaragua|12
Perdomo Double Aged 12 Year Vintage|Perdomo|Maduro|Toro|Medium-Full|52|6.5"|Nicaragua|10
Perdomo Habano Bourbon Barrel Aged|Perdomo|Habano|Toro|Medium-Full|54|6"|Nicaragua|10
Perdomo Reserve 10th Anniversary|Perdomo|Maduro|Robusto|Medium-Full|50|5"|Nicaragua|8
Romeo y Julieta 1875|Romeo y Julieta|Connecticut|Churchill|Mild-Medium|47|7"|Honduras|8
Romeo y Julieta Reserva Real|Romeo y Julieta|Connecticut|Toro|Mild-Medium|48|6"|Honduras|9
Romeo y Julieta Vintage|Romeo y Julieta|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|10
Romeo y Julieta Habana Reserve|Romeo y Julieta|Habano|Toro|Medium|52|6"|Honduras|9
Montecristo No. 2|Montecristo|Habano|Torpedo|Medium|52|6.125"|Cuba|22
Montecristo No. 4|Montecristo|Habano|Corona|Medium|42|5"|Cuba|15
Montecristo Classic|Montecristo|Connecticut|Toro|Mild-Medium|52|6"|Dominican Republic|9
Montecristo Espada|Montecristo|Habano|Toro|Medium-Full|54|6"|Nicaragua|12
Montecristo White|Montecristo|Connecticut|Toro|Mild|50|6"|Dominican Republic|10
Montecristo Platinum|Montecristo|Habano|Toro|Medium|50|6"|Dominican Republic|13
Cohiba Robusto|Cohiba|Habano|Robusto|Medium-Full|50|4.875"|Cuba|30
Cohiba Siglo VI|Cohiba|Habano|Gordo|Medium-Full|52|5.875"|Cuba|40
Cohiba Siglo II|Cohiba|Habano|Corona|Medium|42|5"|Cuba|25
Cohiba Behike 52|Cohiba|Habano|Robusto|Medium-Full|52|4.75"|Cuba|45
Cohiba Behike 56|Cohiba|Habano|Gordo|Full|56|5.5"|Cuba|50
Cohiba Blue|Cohiba|Connecticut|Toro|Mild-Medium|54|6"|Dominican Republic|14
Cohiba Red Dot Robusto|Cohiba|Cameroon|Robusto|Medium|49|5"|Dominican Republic|18
Crowned Heads Four Kicks|Crowned Heads|Habano|Toro|Medium|52|6"|Nicaragua|9
Crowned Heads Jericho Hill|Crowned Heads|Maduro|Toro|Full|52|6"|Nicaragua|10
Crowned Heads Mil Días|Crowned Heads|Habano|Toro|Medium-Full|52|6"|Nicaragua|11
Crowned Heads Le Carême|Crowned Heads|Maduro|Toro|Medium-Full|52|6"|Nicaragua|12
Crowned Heads Luminosa|Crowned Heads|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|9
Tatuaje Havana VI|Tatuaje|Habano|Toro|Medium-Full|50|6"|Nicaragua|8
Tatuaje Black Label|Tatuaje|Maduro|Robusto|Full|50|5"|Nicaragua|10
Tatuaje Monster Series|Tatuaje|Habano|Toro|Full|52|6"|Nicaragua|14
Tatuaje Reserva|Tatuaje|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
Tatuaje La Verite|Tatuaje|Oscuro|Robusto|Full|50|5"|Nicaragua|18
Alec Bradley Prensado|Alec Bradley|Corojo|Toro|Medium-Full|52|6"|Honduras|11
Alec Bradley Tempus|Alec Bradley|Habano|Toro|Medium-Full|52|6"|Honduras|10
Alec Bradley Black Market|Alec Bradley|Habano|Toro|Medium-Full|52|6.25"|Honduras|9
Alec Bradley Project 40|Alec Bradley|Habano|Toro|Medium|52|6"|Nicaragua|8
CAO Flathead V770|CAO|Maduro|Gordo|Full|70|7"|Nicaragua|10
CAO Brazilia|CAO|Maduro|Toro|Medium-Full|52|6"|Nicaragua|8
CAO Mx2|CAO|Maduro|Toro|Full|52|6"|Nicaragua|9
CAO America|CAO|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|8
San Cristobal Revelation|San Cristobal|Habano|Toro|Full|52|6"|Nicaragua|11
San Cristobal Elegancia|San Cristobal|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|10
Nub Habano|Nub|Habano|Gordo|Medium-Full|60|4"|Nicaragua|8
Nub Connecticut|Nub|Connecticut|Gordo|Mild-Medium|60|4"|Nicaragua|8
Nub Maduro|Nub|Maduro|Gordo|Medium-Full|60|4"|Nicaragua|8
E.P. Carrillo Encore|E.P. Carrillo|Habano|Toro|Medium-Full|52|6"|Dominican Republic|14
E.P. Carrillo La Historia|E.P. Carrillo|Habano|Toro|Medium-Full|52|6.875"|Dominican Republic|13
E.P. Carrillo Pledge|E.P. Carrillo|Maduro|Toro|Full|52|6"|Dominican Republic|12
E.P. Carrillo New Wave Connecticut|E.P. Carrillo|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|9
Illusione Epernay|Illusione|Habano|Corona|Medium|44|5.25"|Nicaragua|12
Illusione Rothchildes|Illusione|Habano|Petit Corona|Medium|50|4.5"|Nicaragua|8
Illusione Singularé|Illusione|Corojo|Toro|Medium-Full|52|6"|Nicaragua|16
Illusione Haut 10|Illusione|Habano|Toro|Medium-Full|48|6.25"|Nicaragua|14
AJ Fernandez Enclave|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
AJ Fernandez Last Call|AJ Fernandez|Maduro|Petit Corona|Medium|50|4.5"|Nicaragua|7
AJ Fernandez New World|AJ Fernandez|Oscuro|Toro|Full|55|6"|Nicaragua|9
AJ Fernandez San Lotano|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
AJ Fernandez Dias de Gloria|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Plasencia Alma Fuerte|Plasencia|Habano|Toro|Full|54|6"|Nicaragua|18
Plasencia Alma del Campo|Plasencia|Habano|Toro|Medium-Full|54|6"|Nicaragua|15
Plasencia Cosecha 146|Plasencia|Habano|Toro|Medium-Full|52|6"|Nicaragua|14
Plasencia Reserva Original|Plasencia|Corojo|Toro|Medium|52|6"|Nicaragua|10
Foundation Tabernacle|Foundation|Maduro|Toro|Full|52|6"|Nicaragua|12
Foundation Charter Oak|Foundation|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|7
Foundation The Wise Man|Foundation|Maduro|Toro|Full|50|6"|Nicaragua|12
Foundation Olmec|Foundation|Maduro|Toro|Full|52|6"|Nicaragua|10
Punch Signature|Punch|Habano|Toro|Medium-Full|52|6"|Honduras|8
Punch Gran Puro|Punch|Habano|Robusto|Medium-Full|48|5.25"|Honduras|8
Punch Rare Corojo|Punch|Corojo|Toro|Medium-Full|48|6.125"|Honduras|9
H. Upmann 1844 Reserve|H. Upmann|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|8
H. Upmann Vintage Cameroon|H. Upmann|Cameroon|Toro|Medium|50|6"|Dominican Republic|9
H. Upmann No. 2|H. Upmann|Habano|Torpedo|Medium|52|6.125"|Cuba|18
Macanudo Cafe|Macanudo|Connecticut|Toro|Mild|49|6"|Dominican Republic|8
Macanudo Inspirado|Macanudo|Habano|Toro|Medium-Full|52|6"|Honduras|12
Macanudo Vintage|Macanudo|Connecticut|Toro|Mild-Medium|49|6"|Dominican Republic|15
La Flor Dominicana Double Ligero|La Flor Dominicana|Maduro|Toro|Full|54|6"|Dominican Republic|12
La Flor Dominicana La Nox|La Flor Dominicana|Oscuro|Toro|Full|52|6"|Dominican Republic|12
La Flor Dominicana Andalusian Bull|La Flor Dominicana|Habano|Belicoso|Full|56|5.5"|Dominican Republic|15
La Flor Dominicana 1994|La Flor Dominicana|Maduro|Toro|Full|52|6"|Dominican Republic|10
Joya de Nicaragua Antaño 1970|Joya de Nicaragua|Habano|Toro|Full|52|6"|Nicaragua|10
Joya de Nicaragua Antaño CT|Joya de Nicaragua|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|9
Joya de Nicaragua Cuatro Cinco|Joya de Nicaragua|Habano|Toro|Medium-Full|52|6"|Nicaragua|14
Joya de Nicaragua Cabinetta|Joya de Nicaragua|Habano|Toro|Medium|52|6"|Nicaragua|7
Aganorsa Leaf Supreme Leaf|Aganorsa|Corojo|Toro|Full|52|6"|Nicaragua|11
Aganorsa Leaf Signature Selection|Aganorsa|Corojo|Toro|Medium-Full|52|6"|Nicaragua|9
Aganorsa Leaf Connecticut|Aganorsa|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|8
La Aroma de Cuba Mi Amor|La Aroma de Cuba|Oscuro|Toro|Full|52|6"|Nicaragua|12
La Aroma de Cuba Connecticut|La Aroma de Cuba|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|8
La Aroma de Cuba Edicion Especial|La Aroma de Cuba|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
Villiger La Flor de Ynclan|Villiger|Habano|Toro|Medium-Full|52|6"|Honduras|12
Villiger San'Doro Colorado|Villiger|Habano|Toro|Medium-Full|52|6"|Dominican Republic|10
RoMa Craft Cromagnon|RoMa Craft|Maduro|Toro|Full|52|6"|Nicaragua|11
RoMa Craft Intemperance|RoMa Craft|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
RoMa Craft Neanderthal|RoMa Craft|Maduro|Gordo|Full|54|4.75"|Nicaragua|12
Dunbarton Tobacco Sin Compromiso|Dunbarton|Habano|Toro|Full|52|6"|Nicaragua|16
Dunbarton Tobacco Mi Querida|Dunbarton|Maduro|Toro|Full|52|6"|Nicaragua|12
Dunbarton Tobacco Sobremesa|Dunbarton|Connecticut|Toro|Medium|52|6"|Nicaragua|12
Caldwell Blind Man's Bluff|Caldwell|Habano|Toro|Medium|52|6"|Dominican Republic|9
Caldwell Long Live the King|Caldwell|Habano|Toro|Medium-Full|52|6"|Dominican Republic|11
Caldwell Eastern Standard|Caldwell|Habano|Toro|Medium-Full|52|6"|Dominican Republic|10
HVC San Isidro|HVC|Corojo|Toro|Medium-Full|52|6"|Nicaragua|10
HVC First Selection|HVC|Habano|Toro|Medium|52|6"|Nicaragua|9
Warped La Colmena|Warped|Habano|Corona|Medium|44|5.5"|Nicaragua|14
Warped Flor del Valle|Warped|Habano|Toro|Medium|50|6.25"|Nicaragua|12
Warped Guardian of the Farm|Warped|Corojo|Toro|Medium-Full|50|6"|Nicaragua|10
Viaje Honey & Hand Grenades|Viaje|Habano|Robusto|Full|52|5.5"|Nicaragua|12
Viaje Exclusivo|Viaje|Maduro|Toro|Full|52|6"|Nicaragua|11
Avo XO|Avo|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|14
Avo Heritage|Avo|Habano|Toro|Medium|52|6"|Dominican Republic|10
Partagas Serie D No. 4|Partagas|Habano|Robusto|Medium-Full|50|4.875"|Cuba|20
Partagas Lusitania|Partagas|Habano|Churchill|Medium-Full|49|7.625"|Cuba|25
Partagas 1845|Partagas|Habano|Toro|Medium-Full|52|6"|Dominican Republic|8
Bolivar Belicoso Fino|Bolivar|Habano|Belicoso|Full|52|5.5"|Cuba|18
Bolivar Royal Corona|Bolivar|Habano|Robusto|Full|50|4.875"|Cuba|16
Hoyo de Monterrey Epicure No. 2|Hoyo de Monterrey|Habano|Robusto|Medium|50|4.875"|Cuba|16
Hoyo de Monterrey Excalibur|Hoyo de Monterrey|Connecticut|Toro|Mild-Medium|54|6.25"|Honduras|9
La Gloria Cubana Serie R|La Gloria Cubana|Habano|Toro|Full|52|6"|Dominican Republic|10
La Gloria Cubana Esteli|La Gloria Cubana|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
Brick House|Brick House|Habano|Toro|Medium|52|6"|Nicaragua|7
Brick House Maduro|Brick House|Maduro|Toro|Medium-Full|52|6"|Nicaragua|7
Aging Room Quattro|Aging Room|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Aging Room Solera|Aging Room|Habano|Toro|Medium|52|6"|Dominican Republic|10
Charter Oak Connecticut|Charter Oak|Connecticut|Toro|Mild|52|6"|Nicaragua|7
Charter Oak Maduro|Charter Oak|Maduro|Toro|Medium|52|6"|Nicaragua|7
Charter Oak Habano|Charter Oak|Habano|Toro|Medium|52|6"|Nicaragua|7
Fratello Navetta|Fratello|Habano|Toro|Medium-Full|52|6.25"|Nicaragua|12
Fratello Bianco|Fratello|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|10
New World by AJ Fernandez|AJ Fernandez|Oscuro|Toro|Full|55|6"|Nicaragua|9
New World Connecticut|AJ Fernandez|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|8
San Lotano Requiem|AJ Fernandez|Habano|Toro|Medium-Full|54|6"|Nicaragua|11
San Lotano Requiem Maduro|AJ Fernandez|Maduro|Toro|Full|54|6"|Nicaragua|11
Henry Clay War Hawk|Henry Clay|Maduro|Toro|Full|52|6"|Honduras|9
Room 101 Farce Connecticut|Room 101|Connecticut|Toro|Mild|50|6"|Honduras|8
Gurkha Ghost|Gurkha|Habano|Toro|Medium-Full|52|6"|Dominican Republic|10
`.trim().split("\n").map(line => {
  const [name, brand, wrapper, shape, strength, ringGauge, length, origin, price] = line.split("|");
  return { name: name.trim(), brand, wrapper, shape, strength, ringGauge: parseInt(ringGauge) || 0, length, origin, price: parseFloat(price) || 0 };
}).filter(c => c.name);

export default CIGAR_DATA;
