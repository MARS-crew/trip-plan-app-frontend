import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Animated,
  PanResponder,
} from "react-native";

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = 100;
const SIDE_PADDING = 50;
const CARD_WIDTH = width - SIDE_PADDING * 2;

const TRAVEL_DATA = [
  { id: "1-1", day: 1, pos: 1, title: "1일차-1번 장소", desc: "첫 일정", time: "09:00", addr: "오사카" },
  { id: "1-2", day: 1, pos: 2, title: "1일차-2번 장소", desc: "두 번째", time: "11:00", addr: "오사카" },
  { id: "1-3", day: 1, pos: 3, title: "1일차-3번 장소", desc: "세 번째", time: "13:00", addr: "오사카" },
  { id: "1-4", day: 1, pos: 4, title: "1일차-4번 장소", desc: "네 번째", time: "15:00", addr: "오사카" },

  { id: "2-1", day: 2, pos: 1, title: "2일차-1번 장소", desc: "새로운 날", time: "09:00", addr: "오사카" },
  { id: "2-2", day: 2, pos: 2, title: "2일차-2번 장소", desc: "오전 일정", time: "11:00", addr: "오사카" },
  { id: "2-3", day: 2, pos: 3, title: "2일차-3번 장소", desc: "점심", time: "13:00", addr: "오사카" },
  { id: "2-4", day: 2, pos: 4, title: "2일차-4번 장소", desc: "저녁", time: "15:00", addr: "오사카" },

  { id: "3-1", day: 3, pos: 1, title: "3일차-1번 장소", desc: "교토 이동", time: "09:00", addr: "교토" },
  { id: "3-2", day: 3, pos: 2, title: "3일차-2번 장소", desc: "관광", time: "11:00", addr: "교토" },
  { id: "3-3", day: 3, pos: 3, title: "3일차-3번 장소", desc: "식사", time: "13:00", addr: "교토" },
  { id: "3-4", day: 3, pos: 4, title: "3일차-4번 장소", desc: "산책", time: "15:00", addr: "교토" },

  { id: "4-1", day: 4, pos: 1, title: "4일차-1번 장소", desc: "마지막 날", time: "09:00", addr: "공항" },
  { id: "4-2", day: 4, pos: 2, title: "4일차-2번 장소", desc: "쇼핑", time: "11:00", addr: "공항" },
  { id: "4-3", day: 4, pos: 3, title: "4일차-3번 장소", desc: "점심", time: "13:00", addr: "공항" },
  { id: "4-4", day: 4, pos: 4, title: "4일차-4번 장소", desc: "출국", time: "15:00", addr: "공항" },
];

export default function App() {

  const [day, setDay] = useState(1);
  const [pos, setPos] = useState(1);

  const dayRef = useRef(day);
  const posRef = useRef(pos);

  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const current = TRAVEL_DATA.find(
    (item) => item.day === day && item.pos === pos
  );

  const panResponder = useRef(
    PanResponder.create({

      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: (e, { dx, dy }) => {

        const isHorizontal = Math.abs(dx) > Math.abs(dy);

        let nextDay = dayRef.current;
        let nextPos = posRef.current;

        if (isHorizontal) {

          if (dx < -100 && nextDay < 4) {
            nextDay += 1;
            nextPos = 1;
          }

          if (dx > 100 && nextDay > 1) {
            nextDay -= 1;
            nextPos = 1;
          }

        } else {

          if (dy < -100 && nextPos < 4) nextPos += 1;
          if (dy > 100 && nextPos > 1) nextPos -= 1;

        }

        Animated.parallel([
          Animated.timing(pan, {
            toValue: {
              x: isHorizontal ? (dx > 0 ? width : -width) : 0,
              y: isHorizontal ? 0 : (dy > 0 ? height : -height),
            },
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start(() => {

          dayRef.current = nextDay;
          posRef.current = nextPos;

          setDay(nextDay);
          setPos(nextPos);

          pan.setValue({
            x: isHorizontal ? (dx > 0 ? -width : width) : 0,
            y: isHorizontal ? 0 : (dy > 0 ? -height : height),
          });

          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              friction: 7,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();

        });

      },

    })
  ).current;

  if (!current) return null;

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.mapArea}>
        <Text style={styles.mapText}>지도 영역</Text>

        <View style={styles.dayBadge}>
          <Text style={styles.dayText}>Day {day}</Text>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              transform: pan.getTranslateTransform(),
              opacity,
            },
          ]}
        >

          <View style={styles.cardLeft}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{current.pos}</Text>
            </View>
          </View>

          <View style={styles.cardCenter}>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.addr}>📍 {current.addr}</Text>
            <Text style={styles.desc}>{current.desc}</Text>
          </View>

          <View style={styles.cardRight}>
            <Text style={styles.time}>{current.time}</Text>
          </View>

        </Animated.View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#FFF" },

  mapArea: {
    flex: 1,
    backgroundColor: "#E9ECEF",
    justifyContent: "center",
    alignItems: "center",
  },

  mapText: { color: "#ADB5BD", fontSize: 16 },

  dayBadge: {
    position: "absolute",
    top: 20,
    backgroundColor: "#FF6B00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  dayText: { color: "#FFF", fontWeight: "bold" },

  cardWrapper: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    elevation: 10,
  },

  cardLeft: { marginRight: 15 },

  numberBadge: {
    width: 28,
    height: 28,
    backgroundColor: "#9C27B0",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  numberText: { color: "#FFF", fontWeight: "bold" },

  cardCenter: { flex: 1 },

  title: { fontSize: 18, fontWeight: "bold" },

  addr: { fontSize: 11, color: "#999" },

  desc: { fontSize: 12, color: "#666" },

  cardRight: { alignSelf: "flex-start" },

  time: { fontSize: 10, color: "#999" },

});