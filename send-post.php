<?php session_start();
  function normalizePhone($str) {
      $arr = str_split($str);

    return '+' 
      . $arr[0] 
      . ' ('
      . $arr[1] . $arr[2] . $arr[3] 
      . ') '
      . $arr[4] . $arr[5] . $arr[6] 
      . '-' 
      . $arr[7] . $arr[8] 
      . '-' 
      . $arr[9] . $arr[10];
  }
  
  function uploadFiles($request_files) {
  // Разрешенные расширения файлов.
  $allow = array('png', 'jpg', 'jpeg', 'gif', 'avi', 'mp4', 'mov');
  
  // Запрещенные расширения файлов.
  $deny = array(
    'phtml', 'php', 'php3', 'php4', 'php5', 'php6', 'php7', 'phps', 'cgi', 'pl', 'asp', 
    'aspx', 'shtml', 'shtm', 'htaccess', 'htpasswd', 'ini', 'log', 'sh', 'js', 'html', 
    'htm', 'css', 'sql', 'spl', 'scgi', 'fcgi', 'exe'
  );

  // Директория куда будут загружаться файлы.
  $path = __DIR__ . '/uploads/';

  // Массив для результатов
  $data = array();

  foreach ($request_files as $file) {
    $error = $success = '';
 
    // Проверим на ошибки загрузки.
    if (!empty($file['error']) || empty($file['tmp_name'])) {
      $error = 'Не удалось загрузить файл.';
    } elseif ($file['tmp_name'] == 'none' || !is_uploaded_file($file['tmp_name'])) {
      $error = 'Не удалось загрузить файл.';
    } else {
      // Оставляем в имени файла только буквы, цифры и некоторые символы.
      $pattern = "[^a-zа-яё0-9,~!@#%^-_\$\?\(\)\{\}\[\]\.]";
      $name = mb_eregi_replace($pattern, '-', $file['name']);
      $name = mb_ereg_replace('[-]+', '-', $name);
      $parts = pathinfo($name);
      
      if (empty($name) || empty($parts['extension'])) {
        $error = 'Недопустимый тип файла';
      } elseif (!empty($allow) && !in_array(strtolower($parts['extension']), $allow)) {
        $error = 'Недопустимый тип файла';
      } elseif (!empty($deny) && in_array(strtolower($parts['extension']), $deny)) {
        $error = 'Недопустимый тип файла';
      } else {
        // Перемещаем файл в директорию.
        if (move_uploaded_file($file['tmp_name'], $path . $name)) {
          // Здесь можно сохранить название файла в БД и другие действия !!!!!
          $success = 'Файл успешно загружен';
        } else {
          $error = 'Не удалось загрузить файл';
        }
      }
    }
    
    if (!empty($success)) {
      $data[] = [true, $name, $success, 'https://u1430355.isp.regruhosting.ru/temp/uploads/'. $name];  
    }
    if (!empty($error)) {
      $data[] = [false, $name, $error];  
    }
  }
  
  return $data;
}

  if (isset($_POST['json'])) {

    $json = strip_tags(trim($_POST['json']));
    $data = json_decode($json, true);

    $message = 'Сообщение пользователя с сайта Квиз лендинга.' . "\r\n";

    switch ($data['id']) {
      case '#getContact':
        $message .= "Пльзователь заполнил квиз и указал контакты." . "\r\n\n";
        $message .= "Данные внесенные пользователем: " . "\r\n";
        $message .= "Сообщение было отправлено из формы: " . $data['from'] . "\r\n";
        $message .= "Предпочитаемый способ связи: " . $data['connect'] . "\r\n";
        $message .= "Пользователь указал телефон: " . normalizePhone($data['phone']) . "\r\n";
        $message .= $data['animal'][0] . ": " . $data['animal'][1] . "\r\n";
        $message .= $data['count'][0] . ": " . $data['count'][1] . "\r\n";

        if (isset($data['size'])) {
          $message .= $data['size'][0] . ": " . $data['size'][1] . "\r\n";
        }

        if (isset($data['player'])) {
          $message .= $data['player'][0] . ": " . $data['player'][1] . "\r\n";
        }    

        $message .= $data['sleeping'][0] . ": " . $data['sleeping'][1] . "\r\n";
        $message .= $data['renovation'][0] . ": " . $data['renovation'][1] . "\r\n";

        if (isset($data['style'])) {
          $message .= $data['style'][0] . ": " . $data['style'][1] . "\r\n";
        }
        break;

      case '#fastConsultation':
        $message .= "Пользователь запросил быструю консультацию. " . "\r\n\n";
        $message .= "Данные внесенные пользователем: " . "\r\n";
        $message .= "Сообщение было отправлено из формы: " . $data['from'] . "\r\n";
        $message .= "Удобное вермя для контакта: " . $data['callbackTime'] . "\r\n";
        $message .= "Пользователь указал телефон: " . normalizePhone($data['phone']) . "\r\n";
        break;

      case '#changePhone':
        $message .= "Пользователь решил изменить номер телефона." . "\r\n\n";
        $message .= "Данные внесенные пользователем: " . "\r\n";
        $message .= "Сообщение было отправлено из формы: " . $data['from'] . "\r\n";
        $message .= "Пользователь изменил номер телефона на: " . normalizePhone($data['phone']) . "\r\n";
        break;

      case '#checkPhone':
        $message .= "Пользователь заполнил форму Проконсультироваться. " . "\r\n\n";
        $message .= "Данные внесенные пользователем: " . "\r\n";
        $message .= "Сообщение было отправлено из формы: " . $data['from'] . "\r\n";
        $message .= "Удобное вермя для контакта: " . $data['callbackTime'] . "\r\n";
        $message .= "Пользователь указал телефон: " . normalizePhone($data['phone']) . "\r\n";
        break;

      case '#sendPhoto':
        $message .= "Пользователь прикрепил файл(ы). " . "\r\n\n";
        $message .= "Данные внесенные пользователем: " . "\r\n";
        $message .= "Сообщение было отправлено из формы: " . $data['from'] . "\r\n";
        $message .= "Пользователь указал телефон: " . normalizePhone($data['phone']) . "\r\n";
        
        $arResponse['upload'] = uploadFiles($_FILES);
        
        if (count($arResponse['upload']) > 0) {
          $message .= "\r\nПрикреплённые файлы: \r\n";          
          foreach ($arResponse['upload'] as $file) {
              if ($file[0]) {
                $message .= $file[3] . "\r\n";
              } else {
                $message .= $file[2] . ' ' .  $file[1] . "\r\n";
              }
          }
        }
        break;
  }

  $message .= "\r\n\n" . '*******' . "\r\n";
  $message .= "Не отвечайте на это сообщение через онлайн почту или в вашем почтовом клиенте." . "\r\n"; 
  $message .= "Cообщение сгенерировано автоматически." . "\r\n"; 
  $message .= "Для контакта с посетителем сайта, используйте данные указанные выше." . "\r\n";

  $to      = 'anar.n.agaev@gmail.com';
  $subject = 'Сообщение пользователя сайта Квиз лендинга.';
  $headers = array(
    'From' => 'webmaster@example.com',
    'Reply-To' => 'webmaster@example.com',
    'X-Mailer' => 'PHP/' . phpversion()
  );

  $arResponse['error'] = mail($to, $subject, $message, $headers);
  $arResponse['post'] = json_decode($_POST['json']);
  $arResponse['files'] = $_FILES;

  $JSON__DATA = defined('JSON_UNESCAPED_UNICODE')
    ? json_encode($arResponse, JSON_UNESCAPED_UNICODE)
    : json_encode($arResponse);
  echo $JSON__DATA;
}
?>