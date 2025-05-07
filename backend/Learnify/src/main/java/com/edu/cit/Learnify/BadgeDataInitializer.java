//package com.edu.cit.Learnify;
//
//
//import com.edu.cit.Learnify.Entity.Badge;
//import com.edu.cit.Learnify.Repository.BadgeRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.Arrays;
//import java.util.List;
//
//@Component
//public class BadgeDataInitializer implements CommandLineRunner {
//
//    @Autowired
//    private BadgeRepository badgeRepository;
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Check if we already have badges
//        if (badgeRepository.count() == 0) {
//            createInitialBadges();
//        }
//    }
//
//    private void createInitialBadges() {
//        List<Badge> badges = Arrays.asList(
//                new Badge(
//                        "First Steps",
//                        "Complete your first lesson",
//                        "/badges/first-steps.png",
//                        "Awarded when a student completes their first lesson",
//                        10,
//                        "Engagement"
//                ),
//                new Badge(
//                        "Quiz Master",
//                        "Score 100% on a quiz",
//                        "/badges/quiz-master.png",
//                        "Awarded when a student scores 100% on any quiz",
//                        20,
//                        "Achievement"
//                ),
//                new Badge(
//                        "Regular Learner",
//                        "Log in for 5 consecutive days",
//                        "/badges/regular-learner.png",
//                        "Awarded for logging in 5 days in a row",
//                        50,
//                        "Engagement"
//                ),
//                new Badge(
//                        "Homework Hero",
//                        "Submit 10 homework assignments",
//                        "/badges/homework-hero.png",
//                        "Awarded after submitting 10 homework assignments",
//                        100,
//                        "Achievement"
//                ),
//                new Badge(
//                        "Point Collector",
//                        "Earn 500 points",
//                        "/badges/point-collector.png",
//                        "Awarded when total points reach 500",
//                        500,
//                        "Learning Progress"
//                ),
//                new Badge(
//                        "Learning Master",
//                        "Reach level 10",
//                        "/badges/learning-master.png",
//                        "Awarded when student reaches level 10",
//                        1000,
//                        "Learning Progress"
//                )
//        );
//
//        badgeRepository.saveAll(badges);
//    }
//}