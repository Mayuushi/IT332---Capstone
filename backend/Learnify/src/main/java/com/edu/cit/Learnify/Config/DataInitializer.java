// package com.edu.cit.Learnify.Config;

// import com.edu.cit.Learnify.Entity.DialogNode;
// import com.edu.cit.Learnify.Repository.DialogNodeRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// import java.util.Arrays;
// import java.util.Collections;
// import java.util.List;

// @Component
// @RequiredArgsConstructor
// public class DataInitializer implements CommandLineRunner {
//     private final DialogNodeRepository dialogNodeRepository;

//     @Override
//     public void run(String... args) {
//         if (dialogNodeRepository.count() == 0) {
//             // Initialize with sample dialog nodes for a nervous system lesson

//             // Node 1: Introduction
//             DialogNode node1 = new DialogNode();
//             node1.setId("intro");
//             node1.setText("Welcome to our lesson on the nervous system! I'm Dr. Neura, and I'll be your guide through this fascinating journey.");
//             node1.setCharacter("doctor");
//             node1.setBackground("laboratory");
//             node1.setCharacterImage("doctor_neutral");

//             DialogNode.DialogChoice choice1_1 = new DialogNode.DialogChoice();
//             choice1_1.setText("I'm excited to learn about the nervous system!");
//             choice1_1.setNextNodeId("overview");

//             DialogNode.DialogChoice choice1_2 = new DialogNode.DialogChoice();
//             choice1_2.setText("Can we start with the basic structure?");
//             choice1_2.setNextNodeId("structure");

//             node1.setChoices(Arrays.asList(choice1_1, choice1_2));
//             node1.setEndNode(false);

//             // Node 2: Overview
//             DialogNode node2 = new DialogNode();
//             node2.setId("overview");
//             node2.setText("The nervous system is the body's command center. It consists of the central nervous system (brain and spinal cord) and the peripheral nervous system, which connects the CNS to the rest of the body.");
//             node2.setCharacter("doctor");
//             node2.setBackground("classroom");
//             node2.setCharacterImage("doctor_explaining");

//             DialogNode.DialogChoice choice2_1 = new DialogNode.DialogChoice();
//             choice2_1.setText("Tell me more about the central nervous system.");
//             choice2_1.setNextNodeId("cns");

//             DialogNode.DialogChoice choice2_2 = new DialogNode.DialogChoice();
//             choice2_2.setText("I'd like to learn about the peripheral nervous system.");
//             choice2_2.setNextNodeId("pns");

//             node2.setChoices(Arrays.asList(choice2_1, choice2_2));
//             node2.setEndNode(false);

//             // Node 3: Structure
//             DialogNode node3 = new DialogNode();
//             node3.setId("structure");
//             node3.setText("The nervous system is made up of neurons, which are specialized cells that transmit signals. These neurons form networks that allow information to travel throughout your body.");
//             node3.setCharacter("doctor");
//             node3.setBackground("neuron_diagram");
//             node3.setCharacterImage("doctor_pointing");

//             DialogNode.DialogChoice choice3_1 = new DialogNode.DialogChoice();
//             choice3_1.setText("How do neurons communicate?");
//             choice3_1.setNextNodeId("neuron_communication");

//             DialogNode.DialogChoice choice3_2 = new DialogNode.DialogChoice();
//             choice3_2.setText("What are the parts of a neuron?");
//             choice3_2.setNextNodeId("neuron_parts");

//             node3.setChoices(Arrays.asList(choice3_1, choice3_2));
//             node3.setEndNode(false);

//             // Node 4: Central Nervous System
//             DialogNode node4 = new DialogNode();
//             node4.setId("cns");
//             node4.setText("The central nervous system consists of the brain and spinal cord. The brain processes information and controls conscious functions, while the spinal cord serves as a highway for signals between the brain and the rest of the body.");
//             node4.setCharacter("doctor");
//             node4.setBackground("brain_diagram");
//             node4.setCharacterImage("doctor_enthusiastic");

//             DialogNode.DialogChoice choice4_1 = new DialogNode.DialogChoice();
//             choice4_1.setText("What are the main parts of the brain?");
//             choice4_1.setNextNodeId("brain_parts");

//             DialogNode.DialogChoice choice4_2 = new DialogNode.DialogChoice();
//             choice4_2.setText("Return to the main menu");
//             choice4_2.setNextNodeId("intro");

//             node4.setChoices(Arrays.asList(choice4_1, choice4_2));
//             node4.setEndNode(false);

//             // Node 5: Peripheral Nervous System
//             DialogNode node5 = new DialogNode();
//             node5.setId("pns");
//             node5.setText("The peripheral nervous system includes all the nerves that branch out from the CNS. It has two main divisions: the somatic nervous system (voluntary control) and the autonomic nervous system (involuntary functions).");
//             node5.setCharacter("doctor");
//             node5.setBackground("body_nerves");
//             node5.setCharacterImage("doctor_teaching");

//             DialogNode.DialogChoice choice5_1 = new DialogNode.DialogChoice();
//             choice5_1.setText("Tell me about the autonomic nervous system.");
//             choice5_1.setNextNodeId("ans");

//             DialogNode.DialogChoice choice5_2 = new DialogNode.DialogChoice();
//             choice5_2.setText("Return to the main menu");
//             choice5_2.setNextNodeId("intro");

//             node5.setChoices(Arrays.asList(choice5_1, choice5_2));
//             node5.setEndNode(false);

//             // Node 6: Neuron Communication
//             DialogNode node6 = new DialogNode();
//             node6.setId("neuron_communication");
//             node6.setText("Neurons communicate through electrochemical signals. When a neuron is stimulated, it generates an electrical impulse that travels down its axon. At the synapse, chemical messengers called neurotransmitters carry the signal to the next neuron.");
//             node6.setCharacter("doctor");
//             node6.setBackground("synapse_closeup");
//             node6.setCharacterImage("doctor_detailed");
//             node6.setChoices(Collections.singletonList(new DialogNode.DialogChoice() {{
//                 setText("That's fascinating! Let's return to the main menu.");
//                 setNextNodeId("intro");
//             }}));
//             node6.setEndNode(false);

//             // Node 7: Neuron Parts
//             DialogNode node7 = new DialogNode();
//             node7.setId("neuron_parts");
//             node7.setText("A neuron has three main parts: the cell body (soma) which contains the nucleus, dendrites that receive signals from other neurons, and the axon that transmits signals to other neurons. The axon is often covered by a myelin sheath, which helps speed up signal transmission.");
//             node7.setCharacter("doctor");
//             node7.setBackground("neuron_parts_diagram");
//             node7.setCharacterImage("doctor_teaching");
//             node7.setChoices(Arrays.asList(
//                 new DialogNode.DialogChoice() {{
//                     setText("How do these parts work together?");
//                     setNextNodeId("neuron_function");
//                 }},
//                 new DialogNode.DialogChoice() {{
//                     setText("Let's go back to the main menu.");
//                     setNextNodeId("intro");
//                 }}
//             ));
//             node7.setEndNode(false);

//             // Node 8: Brain Parts
//             DialogNode node8 = new DialogNode();
//             node8.setId("brain_parts");
//             node8.setText("The brain has several major sections: the cerebrum (responsible for thought and voluntary movements), the cerebellum (coordinates movement and balance), the brainstem (controls basic life functions), and the limbic system (involved in emotions and memory).");
//             node8.setCharacter("doctor");
//             node8.setBackground("brain_sections");
//             node8.setCharacterImage("doctor_enthusiastic");
//             node8.setChoices(Arrays.asList(
//                 new DialogNode.DialogChoice() {{
//                     setText("Tell me more about the cerebrum.");
//                     setNextNodeId("cerebrum");
//                 }},
//                 new DialogNode.DialogChoice() {{
//                     setText("Let's go back to the CNS overview.");
//                     setNextNodeId("cns");
//                 }}
//             ));
//             node8.setEndNode(false);

//             // Node 9: Autonomic Nervous System
//             DialogNode node9 = new DialogNode();
//             node9.setId("ans");
//             node9.setText("The autonomic nervous system controls involuntary functions and has two divisions: the sympathetic ('fight or flight') and parasympathetic ('rest and digest') systems. These work in balance to regulate functions like heart rate, digestion, and breathing.");
//             node9.setCharacter("doctor");
//             node9.setBackground("ans_diagram");
//             node9.setCharacterImage("doctor_explaining");
//             node9.setChoices(Arrays.asList(
//                 new DialogNode.DialogChoice() {{
//                     setText("How does the 'fight or flight' response work?");
//                     setNextNodeId("fight_flight");
//                 }},
//                 new DialogNode.DialogChoice() {{
//                     setText("Let's return to the peripheral nervous system.");
//                     setNextNodeId("pns");
//                 }}
//             ));
//             node9.setEndNode(false);

//             // Node 10: Neuron Function
//             DialogNode node10 = new DialogNode();
//             node10.setId("neuron_function");
//             node10.setText("When a neuron functions, dendrites receive signals from other neurons. If these signals reach a threshold, an action potential travels down the axon. At the axon terminal, neurotransmitters are released into the synapse, potentially triggering a response in the next neuron.");
//             node10.setCharacter("doctor");
//             node10.setBackground("neuron_function_animation");
//             node10.setCharacterImage("doctor_detailed");
//             node10.setChoices(Collections.singletonList(new DialogNode.DialogChoice() {{
//                 setText("I understand now. Let's return to the structure overview.");
//                 setNextNodeId("structure");
//             }}));
//             node10.setEndNode(false);

//             // Node 11: Cerebrum
//             DialogNode node11 = new DialogNode();
//             node11.setId("cerebrum");
//             node11.setText("The cerebrum is divided into two hemispheres and four lobes: frontal (reasoning, planning), parietal (sensation, spatial awareness), temporal (hearing, memory), and occipital (vision). The outer layer, called the cerebral cortex, is responsible for higher functions.");
//             node11.setCharacter("doctor");
//             node11.setBackground("cerebrum_lobes");
//             node11.setCharacterImage("doctor_explaining");
//             node11.setChoices(Collections.singletonList(new DialogNode.DialogChoice() {{
//                 setText("That's a lot to take in! Let's go back to the brain overview.");
//                 setNextNodeId("brain_parts");
//             }}));
//             node11.setEndNode(false);

//             // Node 12: Fight or Flight
//             DialogNode node12 = new DialogNode();
//             node12.setId("fight_flight");
//             node12.setText("During the 'fight or flight' response, your sympathetic nervous system activates, releasing adrenaline and increasing heart rate, breathing, and blood flow to muscles. This prepares your body to respond to perceived threats or stressors quickly.");
//             node12.setCharacter("doctor");
//             node12.setBackground("stress_response");
//             node12.setCharacterImage("doctor_animated");
//             node12.setChoices(Arrays.asList(
//                 new DialogNode.DialogChoice() {{
//                     setText("What happens during the 'rest and digest' response?");
//                     setNextNodeId("rest_digest");
//                 }},
//                 new DialogNode.DialogChoice() {{
//                     setText("Let's go back to the autonomic nervous system.");
//                     setNextNodeId("ans");
//                 }}
//             ));
//             node12.setEndNode(false);

//             // Node 13: Rest and Digest
//             DialogNode node13 = new DialogNode();
//             node13.setId("rest_digest");
//             node13.setText("The 'rest and digest' response is controlled by your parasympathetic nervous system. It slows heart rate, increases digestive activity, and generally conserves energy. This system helps your body return to a calm state after stress and handles regular maintenance functions.");
//             node13.setCharacter("doctor");
//             node13.setBackground("relaxation_state");
//             node13.setCharacterImage("doctor_calm");
//             node13.setChoices(Collections.singletonList(new DialogNode.DialogChoice() {{
//                 setText("This completes our overview. Let's return to the main menu.");
//                 setNextNodeId("intro");
//             }}));
//             node13.setEndNode(false);

//             // Final Quiz Node
//             DialogNode node14 = new DialogNode();
//             node14.setId("final_quiz");
//             node14.setText("Congratulations! You've completed our tour of the nervous system. Would you like to test your knowledge with a quiz?");
//             node14.setCharacter("doctor");
//             node14.setBackground("classroom");
//             node14.setCharacterImage("doctor_smiling");
//             node14.setChoices(Arrays.asList(
//                 new DialogNode.DialogChoice() {{
//                     setText("Yes, I'm ready for the quiz!");
//                     setNextNodeId("quiz_start");
//                 }},
//                 new DialogNode.DialogChoice() {{
//                     setText("No thanks, I'd like to review the material first.");
//                     setNextNodeId("intro");
//                 }}
//             ));
//             node14.setEndNode(false);

//             // Quiz Start Node
//             DialogNode node15 = new DialogNode();
//             node15.setId("quiz_start");
//             node15.setText("Great! Let's begin the quiz. Remember, you can always review the content if needed.");
//             node15.setCharacter("doctor");
//             node15.setBackground("exam_room");
//             node15.setCharacterImage("doctor_encouraging");
//             node15.setChoices(Collections.singletonList(new DialogNode.DialogChoice() {{
//                 setText("Start the quiz");
//                 setNextNodeId("quiz_question_1");
//             }}));
//             node15.setEndNode(false);

//             // Save all nodes
//             List<DialogNode> nodes = Arrays.asList(node1, node2, node3, node4, node5, node6, node7, node8, node9, 
//                                                   node10, node11, node12, node13, node14, node15);
//             dialogNodeRepository.saveAll(nodes);
//         }
//     }
// }