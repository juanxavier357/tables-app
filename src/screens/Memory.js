import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Memory({ route }) {
  const { table } = route.params;
  const totalCards = 12;
  const [cards, setCards] = useState([]);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  useEffect(() => {
    setCards(generateCards(table));
  }, [table]);

  function generateCards(table) {
    const allOptions = [];
    for (let i = 1; i <= 12; i++) {
      allOptions.push(table * i);
    }

    const pairs = [];
    for (let i = 0; i < totalCards / 2; i++) {
      const randomOptionIndex = Math.floor(Math.random() * allOptions.length);
      const randomOption = allOptions.splice(randomOptionIndex, 1)[0];

      pairs.push({
        id: i,
        value: randomOption,
        visible: false,
        matched: false,
      });
      pairs.push({
        id: i + totalCards / 2,
        value: randomOption,
        visible: false,
        matched: false,
      });
    }

    // Shuffle the cards
    return pairs.sort(() => Math.random() - 0.5);
  }

  function handleCardPress(cardId) {
    if (selectedCardIds.length === 2 || cards[cardId].matched) {
      return;
    }

    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, visible: true } : card
    );
    setCards(updatedCards);

    if (!selectedCardIds.includes(cardId)) {
      setSelectedCardIds([...selectedCardIds, cardId]);
    }

    if (selectedCardIds.length === 1) {
      checkMatchedPairs();
    }
  }

  function checkMatchedPairs() {
    const [card1, card2] = selectedCardIds;
    if (cards[card1]?.value === cards[card2]?.value) {
      setMatchedPairs(matchedPairs + 1);
      const updatedCards = cards.map((card, index) =>
        selectedCardIds.includes(index) ? { ...card, matched: true } : card
      );
      setSelectedCardIds([]);
      setCards(updatedCards);
    } else {
      setTimeout(() => {
        const updatedCards = cards.map((card, index) =>
          selectedCardIds.includes(index) ? { ...card, visible: false } : card
        );
        setSelectedCardIds([]);
        setCards(updatedCards);
      }, 1000);
    }
  }

  function resetGame() {
    setMatchedPairs(0);
    setSelectedCardIds([]);
    setCards(generateCards(table));
  }

  return (
    <View style={styles.container}>
      {!matchedPairs ? (
        <View>
          <Text style={styles.title}>Memory Matemática</Text>
          <View style={styles.cardContainer}>
            {cards.map((card) => (
              <View key={card.id} style={styles.card}>
                <Button
                  title={card.visible ? card.value.toString() : "?"}
                  onPress={() => handleCardPress(card.id)}
                  disabled={card.matched || selectedCardIds.includes(card.id)}
                  color={
                    card.visible || selectedCardIds.includes(card.id)
                      ? "#EF6C00"
                      : "#FFC107"
                  }
                />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>¡Juego terminado!</Text>
          <Text style={styles.finalScore}>
            ¡Felicidades! Has encontrado todas las parejas.
          </Text>
          <Button title="Volver a jugar" onPress={resetGame} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9EBB2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#D32F2F",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  card: {
    margin: 8,
    minWidth: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#D32F2F",
  },
  finalScore: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
});
